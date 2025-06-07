import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Device } from './types/device.type';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../../../apps/libs/common/redis/redis-client.factory';
import { UsersRedisKey } from '../const/redis.constant';
import { JwtService } from '@nestjs/jwt';
import { Session } from './types/session.type';

@Injectable()
export class SessionProvider {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async createDeviceSession(
    token: string,
    session: Session,
    expiresAt: number,
  ) {
    try {
      await this.redisClient.hset(
        UsersRedisKey.UsersAuthToken + token,
        session,
      );
      await this.redisClient.expire(
        UsersRedisKey.UsersAuthToken + token,
        Number(expiresAt),
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Session provider: cant create session',
      );
    }
  }
  // add user device to set devices:user:uuid
  async addUserDevice(userId: string, device: Device) {
    try {
      await this.redisClient.sadd(
        `${UsersRedisKey.AllUserDevices}${userId}`,
        JSON.stringify(device),
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Session provider: cant add device',
      );
    }
  }

  async getAllUserDevices(userId: string): Promise<Device[]> {
    const devices = await this.redisClient.smembers(`devices:user:${userId}`);
    if (!devices)
      throw new NotFoundException(
        'Session provider: user devices was not found',
      );
    return devices.map((item) => JSON.parse(item));
  }

  // unique set with lastSeen, not using sAdd because of devices dublicates with lastSeen timestamp
  async updateDeviceLastSeen(userId: string, deviceId: string) {
    const lastSeen = Date.now();
    try {
      return await this.redisClient.set(
        `user:${userId}:device:${deviceId}:lastseen`,
        lastSeen,
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'Session provider:  device last seen was not updated',
      );
    }
  }

  async getUserDevicesLastSeen(
    userId: string,
    devicesId: string[],
  ): Promise<{ deviceId: string; lastSeen: string }[]> {
    try {
      const devicesLastSeen = await Promise.all(
        devicesId.map(async (deviceId) => {
          const lastSeen = await this.redisClient.get(
            `user:${userId}:device:${deviceId}:lastseen`,
          );
          // need this stucture to add lastseen to user devices
          return { deviceId, lastSeen };
        }),
      );
      return devicesLastSeen;
    } catch (err) {
      throw new NotFoundException(
        'Session provider: device last activity was not found',
      );
    }
  }

  async findSessionByToken(token: string): Promise<object> {
    let deviceSessionInfo = await this.redisClient.hgetall(
      UsersRedisKey.UsersAuthToken + token,
    );
    return deviceSessionInfo;
  }

  async deviceLogout(currentDeviceToken: string, tokens?: string[]) {
    try {
      for await (const token of tokens) {
        const session = await this.findSessionByToken(token);
        if (!Object.keys(session).length)
          throw new NotFoundException(
            'Session provider: not valid token in tokens array on logout',
          );
      }
      await this.setSessionNoActive(currentDeviceToken, tokens);
    } catch (err) {
      if (err.status === 404) {
        console.log(err);
        throw new NotFoundException(
          'Session provider: not valid token in tokens array on logout',
        );
      }
      throw new InternalServerErrorException(
        'Session provider: logout problem',
      );
    }
  }

  async verifyToken(token: string): Promise<object> {
    return await this.jwtService.verifyAsync(token);
  }

  async deleteSession(token: string): Promise<void> {
    try {
      const result = await this.redisClient.hdel(
        UsersRedisKey.UsersAuthToken + token,
        'deviceId',
        'userId',
        'active',
        'expiresAt',
        'ip',
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'Session provider: session was not deleted',
      );
    }
  }

  async setSessionNoActive(currentDeviceToken: string, tokens?: string[]) {
    try {
      if (tokens) {
        Promise.all(
          tokens
            .filter((token) => {
              return token !== currentDeviceToken;
            })
            .map(async (token) => {
              await this.redisClient.hset(
                UsersRedisKey.UsersAuthToken + token,
                {
                  active: false,
                },
              );
            }),
        );
      } else {
        await this.redisClient.hset(
          UsersRedisKey.UsersAuthToken + currentDeviceToken,
          {
            active: false,
          },
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Session provider: cant set session to unactive',
      );
    }
  }
}

// todo make logout, return AllUserSessions(make user:sessions:uuid(...tokens), maybe json to hold Devices)

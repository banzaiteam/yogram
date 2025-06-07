import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Device } from './types/device.type';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'apps/libs/common/redis/redis-client.factory';
import { UsersRedisKey } from '../const/redis.constant';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SessionProvider {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async createDeviceSession(token: string, device: Device) {
    try {
      await this.redisClient.hset(UsersRedisKey.UsersAuthToken + token, device);
      await this.redisClient.expire(
        UsersRedisKey.UsersAuthToken + token,
        Number(device.expiresAt),
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('session provider error(redis)');
    }
  }
  // add user device to set devices:user:uuid
  async addUserDevice(userId: string, device: Device) {
    await this.redisClient.sadd(
      `${UsersRedisKey.AllUserDevices}${userId}`,
      JSON.stringify(device),
    );
  }

  async getAllUserDevices(userId: string): Promise<Device[]> {
    const devices = await this.redisClient.smembers(`devices:user:${userId}`);
    return devices.map((item) => JSON.parse(item));
  }

  // unique set with lastSeen, not using sAdd because of devices dublicates with lastSeen timestamp
  async updateDeviceLastSeen(userId: string, deviceId: string) {
    const lastSeen = Date.now();
    return await this.redisClient.set(
      `user:${userId}:device:${deviceId}:lastseen`,
      lastSeen,
    );
  }

  async getUserDevicesLastSeen(
    userId: string,
    devicesId: string[],
  ): Promise<{ deviceId: string; lastSeen: string }[]> {
    const devicesLastSeen = await Promise.all(
      devicesId.map(async (deviceId) => {
        const lastSeen = await this.redisClient.get(
          `user:${userId}:device:${deviceId}:lastseen`,
        );
        return { deviceId, lastSeen };
      }),
    );
    return devicesLastSeen;
  }

  async findSessionbyToken(token: string): Promise<object> {
    console.log('🚀 ~ SessionProvider ~ findSessionbyToken ~ token:', token);
    const deviceSessionInfo = await this.redisClient.hgetall(
      UsersRedisKey.UsersAuthToken + token,
    );
    if (!deviceSessionInfo) {
      throw new InternalServerErrorException('device session was not found');
    }
    return deviceSessionInfo;
  }

  async deviceLogout(tokens: string[]) {
    try {
      await this.setSessionNoActive(tokens);
    } catch (error) {
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
    } catch (error) {
      throw new InternalServerErrorException('session was not deleted');
    }
  }

  async setSessionNoActive(tokens: string[]) {
    try {
      Promise.all(
        tokens.map(async (token) => {
          await this.redisClient.hset(UsersRedisKey.UsersAuthToken + token, {
            active: false,
          });
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'Session provider: cant set session to unactive',
      );
    }
  }
}

// todo make logout, return AllUserSessions(make user:sessions:uuid(...tokens), maybe json to hold Devices)

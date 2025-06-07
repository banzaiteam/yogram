import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Device } from './types/device.type';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'apps/libs/common/redis/redis-client.factory';
import { UsersRedisKey } from '../const/redis.constant';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class SessionProvider {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async createDeviceSession(token: string, device: Device) {
    try {
      await this.redisClient.hset(UsersRedisKey.UsersAuthToken + token, device);
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
    // await this.getAllUserDevices(userId);
  }

  async getAllUserDevices(userId: string): Promise<Device[]> {
    console.log(' `devices:user:${userId}` = ', `devices:user:${userId}`);

    const devices = await this.redisClient.smembers(`devices:user:${userId}`);
    console.log('🚀 ~ SessionProvider ~ getAllUserDevices ~ devices:', devices);
    return devices.map((item) => JSON.parse(item));
  }

  // unique set with lastSeen, not using sAdd because of devices dublicates with lastSeen timestamp
  async updateDeviceLastSeen(userId: string, deviceId: string) {
    const lastSeen = Date.now();
    console.log(
      '🚀 ~ SessionProvider ~ updateDeviceLastSeen ~ lastSeen:',
      lastSeen,
    );
    return await this.redisClient.set(
      `user:${userId}:device:${deviceId}:lastseen`,
      lastSeen,
    );
  }

  async getUserDevicesLastSeen(
    userId: string,
    devicesId: string[],
  ): Promise<{ deviceId: string; lastSeen: string }[]> {
    console.log('devicesId[0]', devicesId[0]);

    const lastSeen = await this.redisClient.get(
      `user:${userId}:device:${devicesId[0]}:lastseen`,
    );
    console.log('🚀 WATCH THSIS lastSeen:', lastSeen);
    const devicesLastSeen = await Promise.all(
      devicesId.map(async (deviceId) => {
        const lastSeen = await this.redisClient.get(
          `user:${userId}:device:${deviceId}:lastseen`,
        );
        console.log(
          '🚀 ~ SessionProvider ~ devicesId.map ~ lastSeen:',
          lastSeen,
        );
        return { deviceId, lastSeen };
      }),
    );
    console.log(
      '🚀 ~ SessionProvider ~ getUserDevicesLastSeen ~ devicesLastSeen:',
      devicesLastSeen,
    );
    return devicesLastSeen;
  }

  async findSessionbyToken(token: string): Promise<object> {
    console.log('🚀 ~ SessionProvider ~ findSessionbyToken ~ token:', token);

    const deviceSessionInfo = await this.redisClient.hgetall(
      UsersRedisKey.UsersAuthToken + token,
    );
    if (!deviceSessionInfo) {
      console.log('no deviceSessionInfo at refreshGuard/sessionProvider');
      throw new InternalServerErrorException('device session was not found');
      // maybe logout
    }
    console.log(
      '🚀 ~ SessionProvider ~ findSessionbyToken ~ deviceSessionInfo:',
      deviceSessionInfo,
    );
    return deviceSessionInfo;
  }

  async verifyToken(token: string): Promise<object> {
    return await this.jwtService.verifyAsync(token);
  }

  async deleteSession(token: string): Promise<void> {
    const result = await this.redisClient.hdel(
      UsersRedisKey.UsersAuthToken + token,
      'deviceId',
      'userId',
      'active',
      'expiresAt',
      'ip',
    );
    if (result < 5)
      throw new InternalServerErrorException('session was not deleted');
  }

  async setSessionNoActive(token: string) {
    const result = await this.redisClient.hset(
      UsersRedisKey.UsersAuthToken + token,
      {
        active: false,
      },
    );
    console.log('🚀 ~ SessionProvider ~ setSessionNoActive ~ session:', result);
    if (result < 1)
      throw new InternalServerErrorException(
        'session was not changed to false',
      );
  }
}

// todo make logout, return AllUserSessions(make user:sessions:uuid(...tokens), maybe json to hold Devices)

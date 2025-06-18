import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'RedisClient';

export const RedisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const redisInstance = new Redis({
      username: configService.get('REDIS_USER'),
      password: configService.get('REDIS_PASSWORD'),
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      reconnectOnError(err) {
        return true;
      },
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [ConfigService],
};

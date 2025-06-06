import { Module } from '@nestjs/common';
import { REDIS_CLIENT, RedisClientFactory } from './redis-client.factory';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RedisClientFactory],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}

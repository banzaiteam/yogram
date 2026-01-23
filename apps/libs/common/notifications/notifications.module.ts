import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { WsAuthAdapter } from './ws-auth.adapter';

@Module({})
export class NotificationsModule {
  static register(): DynamicModule {
    return {
      module: NotificationsModule,
      imports: [
        RedisModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            global: true,
            secret: configService.get('JWT_SECRET'),
          }),
        }),
      ],
      providers: [WsAuthAdapter, NotificationsService, NotificationsGateway],
      exports: [NotificationsGateway, WsAuthAdapter],
    };
  }
}

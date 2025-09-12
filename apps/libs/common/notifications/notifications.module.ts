import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({})
export class NotificationsModule {
  static register(): DynamicModule {
    return {
      module: NotificationsModule,
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            global: true,
            secret: configService.get('JWT_SECRET'),
          }),
        }),
      ],
      providers: [NotificationsService, NotificationsGateway],
    };
  }
}

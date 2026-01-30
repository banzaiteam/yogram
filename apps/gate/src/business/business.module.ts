import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../../apps/libs/gateService';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from 'apps/libs/common/notifications/notifications.module';
import { RequestContextModule } from 'nestjs-request-context';
import { BullModule } from '@nestjs/bullmq';
import { NotificationConsumer } from './notifications-consumer.service';
import { NotificationsProducer } from './notifications-producer.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    RequestContextModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          username: configService.get('REDIS_USER'),
          port: configService.get('REDIS_PORT'),
          host: configService.get('REDIS_HOST'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'NOTIFICATION_SCHEDULER',
      prefix: 'scheduler:',
    }),
    HttpModule,
    NotificationsModule.register(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [BusinessController],
  providers: [
    BusinessService,
    GateService,
    NotificationConsumer,
    NotificationsProducer,
  ],
})
export class BusinessModule {}

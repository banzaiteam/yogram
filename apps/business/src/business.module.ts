import { Module } from '@nestjs/common';
import { BusinessCommandService } from './business-command.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from './settings/configuration';
import { BusinessController } from './api/business.controller';
import { BusinessCommandRepository } from './infrastructure/repository/command/business-command.repository';
import { IBusinessCommandRepository } from './interfaces/business-command-repository.interface';
import {
  SubscribeCommand,
  SubscribeHandler,
} from './application/command/subscribe.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './infrastructure/entity/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { RequestContextModule } from 'nestjs-request-context';
import { BusinessQueryService } from './business-query.service';
import { Subscription } from './infrastructure/entity/subscription.entity';
import {
  SaveSubscriptionCommand,
  SaveSubscriptionHandler,
} from './application/command/save-subscribtion.handler';
import { IBusinessQueryRepository } from './interfaces/business-query-repository.interface';
import { BusinessQueryRepository } from './infrastructure/repository/query/business-query.repository';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  GetCurrentSubscriptionsHandler,
  GetCurrentSubscriptionsQuery,
} from './application/query/get-current-subscriptions-query.handler';
import {
  SuspendSubscriptionCommand,
  SuspendSubscriptionHandler,
} from './application/command/suspend-subscription.handler';
import {
  ActivateSubscriptionCommand,
  ActivateSubscriptionHandler,
} from './application/command/activate-subscription-command.handler';
import {
  SubscriptionUpdatedCommand,
  SubscriptionUpdatedHandler,
} from './application/command/subscription-updated.handler';
import {
  SubscriptionExpiredCommand,
  SubscriptionExpiredHandler,
} from './application/command/subscription-expired.handler';
import {
  GetPaymentsHandler,
  GetPaymentsQuery,
} from './application/query/get-payments.handler';
import { NotificationsModule } from '../../../apps/libs/common/notifications/notifications.module';
import {
  GetUserNotificationsHandler,
  GetUserNotificationsQuery,
} from './application/query/get-user-notifications.handler';
import {
  ReadNotificationCommand,
  ReadNotificationHandler,
} from './application/command/read-notification.command';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProducer } from './notifications-producer.service';
import { NotificationConsumer } from './notifications-consumer.service';
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import { CancelSubscriptionCommand } from './application/command/cancel-subscription.handler';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = ['apps/business/src/.env.development'];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/business/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};
export const NOTIFICATION_SCHEDULER = 'NOTIFICATION_SCHEDULER';
@Module({
  imports: [
    RequestContextModule,
    NotificationsModule.register(),
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
    CqrsModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      ignoreEnvFile:
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
        process.env.NODE_ENV !== EnvironmentMode.TESTING,
      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([Payment, Subscription]),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return <DataSourceOptions>{
    //       type: configService.get('type').toString(),
    //       replication: {
    //         defaultMode: 'master',
    //         master: {
    //           url: configService.get('url'),
    //           migrationsTableName: configService.get('migrationsTableName'),
    //           migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    //           autoLoadEntities: configService.get('autoLoadEntities'),
    //           synchronize: configService.get('synchronize'),
    //           dropSchema: configService.get('dropSchema'),
    //         },
    //         slaves: [
    //           {
    //             url: configService.get('urlSlave'),
    //             migrationsTableName: configService.get('migrationsTableName'),
    //             migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    //             autoLoadEntities: configService.get('autoLoadEntities'),
    //             synchronize: configService.get('synchronize'),
    //             dropSchema: configService.get('dropSchema'),
    //           },
    //         ],
    //       },
    //       entities: [Payment, Subscription],
    //     };
    //   },
    //   dataSourceFactory: async (options) => {
    //     return await new DataSource(options).initialize();
    //   },
    // }),
  ],
  controllers: [BusinessController],
  providers: [
    BusinessCommandService,
    BusinessQueryService,
    SubscribeCommand,
    SubscribeHandler,
    SaveSubscriptionCommand,
    SaveSubscriptionHandler,
    GetCurrentSubscriptionsQuery,
    GetCurrentSubscriptionsHandler,
    SuspendSubscriptionCommand,
    SuspendSubscriptionHandler,
    ActivateSubscriptionHandler,
    ActivateSubscriptionCommand,
    SubscriptionUpdatedCommand,
    SubscriptionUpdatedHandler,
    SubscriptionExpiredCommand,
    CancelSubscriptionCommand,
    SubscriptionExpiredHandler,
    GetUserNotificationsQuery,
    ReadNotificationHandler,
    ReadNotificationCommand,
    GetUserNotificationsHandler,
    GetPaymentsHandler,
    GetPaymentsQuery,
    NotificationsProducer,
    NotificationConsumer,
    {
      provide: IBusinessCommandRepository,
      useClass: BusinessCommandRepository,
    },
    {
      provide: IBusinessQueryRepository,
      useClass: BusinessQueryRepository,
    },
  ],
})
export class BusinessModule {}

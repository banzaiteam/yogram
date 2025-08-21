import { Module } from '@nestjs/common';
import { BusinessCommandService } from './business-command.service';
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from './settings/configuration';
import { BusinessController } from './api/business.controller';
import { PaymentCommandRepository } from './infrastructure/repository/command/payment-command.repository';
import { IPaymentCommandRepository } from './interfaces/payment-command-repository.interface';
import {
  UpdatePlanCommand,
  UpdatePlanHandler,
} from './application/command/update-plan.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './infrastructure/entity/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { RequestContextModule } from 'nestjs-request-context';
import { BusinessQueryService } from './business-query.service';
import {
  PayPalSuccessHandler,
  PayPalSuccessQuery,
} from './application/query/paypal-success.handler';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = ['apps/business/src/.env.development'];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/business/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};

@Module({
  imports: [
    RequestContextModule,
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
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [BusinessController],
  providers: [
    PayPalSuccessQuery,
    PayPalSuccessHandler,
    BusinessCommandService,
    BusinessQueryService,
    UpdatePlanCommand,
    UpdatePlanHandler,
    PaymentCommandRepository,
    { provide: IPaymentCommandRepository, useClass: PaymentCommandRepository },
  ],
})
export class BusinessModule {}

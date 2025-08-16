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

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = ['apps/business/src/.env.development'];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/business/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};

@Module({
  imports: [
    CqrsModule,
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
    BusinessCommandService,
    UpdatePlanCommand,
    UpdatePlanHandler,
    PaymentCommandRepository,
    { provide: IPaymentCommandRepository, useClass: PaymentCommandRepository },
  ],
})
export class BusinessModule {}

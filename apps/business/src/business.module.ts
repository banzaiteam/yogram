import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from './settings/configuration';
import { BusinessController } from './api/business.controller';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  console.log('posts env...');
  const defaultEnvFilePath = ['apps/business/src/.env.development'];
  if (env === EnvironmentMode.TESTING) {
    console.log('business test env...');
    return ['apps/business/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      ignoreEnvFile:
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
        process.env.NODE_ENV !== EnvironmentMode.TESTING,
      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    DatabaseModule.register(),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}

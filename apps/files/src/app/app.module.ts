import { Module } from '@nestjs/common';
import {
  EnvironmentMode,
  EnvironmentsTypes,
} from 'apps/gate/src/settings/configuration';

import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../settings/configuration';
import { FilesModule } from '../files.module';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = [
    'apps/files/src/.env.development',
    'apps/files/src/.env',
  ];
  console.log('at getEnvFilePath.....');

  if (env === EnvironmentMode.TESTING) {
    return ['apps/files/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      ignoreEnvFile:
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
        process.env.NODE_ENV !== EnvironmentMode.TESTING,
      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
  ],
})
export class AppModule {}

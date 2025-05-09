import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from './settings/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from 'apps/libs/common/database/database.module';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = [
    'apps/users/src/.env.development',
    'apps/users/src/.env',
  ];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/users/src/.env.test', ...defaultEnvFilePath];
  }
  if (env === EnvironmentMode.PRODUCTION) {
    console.log('PRODUCTIONPRODUCTION');

    return ['apps/users/src/.env'];
  }

  return defaultEnvFilePath;
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],

      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    DatabaseModule.register(),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      sortSchema: true,
      playground: true, // GraphQL UI
      // context: ({ req }) => ({ req }),
      path: '/api/v1/graphql',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}

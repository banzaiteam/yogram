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
import { UserModelFactory } from './domain/factory/user-model.factory';
import { SqlCommandBaseRepository } from 'apps/libs/common/abstract/sql-command-base-repository.abstract';
import { SqlUserCommandRepository } from './infrastructure/adapters/repository/sql-user-command.repository';
import { CreateUserCommand } from './features/create/command/create-user.command';
import { CreateUserHandler } from './features/create/command/create-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/entity/User.entity';
import { UserModelEntityFactory } from './domain/factory/user-model-entity.factory';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';

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
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],

      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([User]),
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
  providers: [
    UsersService,
    UsersResolver,
    UserModelFactory,
    SqlUserCommandRepository,
    CreateUserCommand,
    UserModelEntityFactory,
    CreateUserHandler,
  ],
})
export class UsersModule {}

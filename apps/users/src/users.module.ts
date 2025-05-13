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
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import { CreateUserCommand } from './features/create/command/create-user.command';
import { CreateUserHandler } from './features/create/command/create-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/entity/User.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommandRepositoryProvider } from './providers/command/user-command-repository.provider';
import { Profile } from './infrastructure/entity/Profile.entity';
import { ProfileCommandRepositoryProvider } from './providers/command/profile-command-repository.provider';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = [
    'apps/users/src/.env.development',
    'apps/users/src/.env',
  ];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/users/src/.env.test', ...defaultEnvFilePath];
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
    TypeOrmModule.forFeature([User, Profile]),
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
    CreateUserCommand,
    CreateUserHandler,
    UserCommandRepositoryProvider,
    ProfileCommandRepositoryProvider,
  ],
})
export class UsersModule {}

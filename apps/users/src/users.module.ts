import { Module } from '@nestjs/common';
import { UsersCommandService } from './users-command.service';
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
import { DatabaseModule } from '../../libs/common/database/database.module';
import { CreateUserCommand } from './features/create/command/create-user.command';
import { CreateUserHandler } from './features/create/command/create-user.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/entity/User.entity';
import { UserCommandRepositoryProvider } from './providers/command/user-command-repository.provider';
import { Profile } from './infrastructure/entity/Profile.entity';
import { ProfileCommandRepositoryProvider } from './providers/command/profile-command-repository.provider';
import { UsersQueryService } from './users-query.service';
import { UsersQueryRepositoryProvider } from './providers/query/users-query-repository.provider';
import { UsersController } from './users.controller';
import { SendVerifyEmailEvent } from './features/create/event/send-verify-email.event';
import { SendVerifyEmailHandler } from './features/create/event/send-verify-email.handler';
import { RabbitProducerModule } from '../../../apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import { EmailVerifyCommand } from './features/email-verify/email-verify.command';
import { EmailVerifyHandler } from './features/email-verify/email-verify.handler';
import { FindUserByCriteriaHandler } from './features/find-by-criteria/query/find-users-by-criteria.handler';
import { FindUserByCriteriaQuery } from './features/find-by-criteria/query/find-users-by-criteria.query';
import { UserQueryRepository } from './infrastructure/repository/query/user-query.repository';
import { UserLoginQuery } from './features/user-login/query/user-login.query';
import { UserLoginQueryHandler } from './features/user-login/query/user-login.handler';
import { UpdateUserByCriteriaCommand } from './features/update/command/update-user-by-criteria.command';
import { UpdateUserByCriteriaHandler } from './features/update/command/update-user-by-criteria.handler';
import { ProviderCommandRepositoryProvider } from './providers/command/provider-command-repository.provider';
import { Provider } from './infrastructure/entity/Provider.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserGoogleCommand } from './features/create-google/command/create-user-google.command';
import { CreateUserGoogleHandler } from './features/create-google/command/create-user-google.handler';
import { FindUserByProviderIdQuery } from './features/find-by-providerid/query/find-user-by-providerId.query';
import { FindUserByProviderIdHandler } from './features/find-by-providerid/query/find-user-by-providerId.handler';
import { ProviderQueryService } from './provider-query.service';
import { ProviderQueryRepositoryProvider } from './providers/query/provider-query-repository.provider';
import { ProviderCommandService } from './provider-command.service';
import { ProfileCommandService } from './profile-command.service';

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
    RabbitProducerModule.register(['users']),
    DatabaseModule.register(),
    TypeOrmModule.forFeature([User, Profile, Provider]),
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
    UsersQueryService,
    UsersCommandService,
    UsersResolver,
    UserLoginQuery,
    UserLoginQueryHandler,
    CreateUserCommand,
    CreateUserHandler,
    UserCommandRepositoryProvider,
    ProfileCommandRepositoryProvider,
    UsersQueryRepositoryProvider,
    SendVerifyEmailEvent,
    SendVerifyEmailHandler,
    EmailVerifyCommand,
    EmailVerifyHandler,
    FindUserByCriteriaHandler,
    FindUserByCriteriaQuery,
    UserQueryRepository,
    UpdateUserByCriteriaCommand,
    UpdateUserByCriteriaHandler,
    ProviderCommandRepositoryProvider,
    CreateUserGoogleCommand,
    CreateUserGoogleHandler,
    FindUserByProviderIdQuery,
    FindUserByProviderIdHandler,
    ProviderQueryService,
    ProviderQueryRepositoryProvider,
    ProviderCommandService,
    ProfileCommandService,
  ],
})
export class UsersModule {}

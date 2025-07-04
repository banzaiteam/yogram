import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from '../settings/configuration';
// import { GraphQLModule } from '@nestjs/graphql';
// import {
//   ApolloFederationDriver,
//   ApolloFederationDriverConfig,
// } from '@nestjs/apollo';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsModule } from '../features/posts/posts.module';
import { AppController } from './app.controller';
import { GateService } from 'apps/libs/gateService';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = [
    'apps/posts/src/.env.development',
    'apps/posts/src/.env',
  ];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/posts/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};
console.log('AT POSTS MODULE...');

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      ignoreEnvFile:
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
        process.env.NODE_ENV !== EnvironmentMode.TESTING,
      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    //   driver: ApolloFederationDriver,
    //   autoSchemaFile: {
    //     federation: 2,
    //   },
    //   sortSchema: true,
    //   playground: true, // GraphQL UI
    //   // context: ({ req }) => ({ req }),
    //   path: '/api/v1/graphql',
    // }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

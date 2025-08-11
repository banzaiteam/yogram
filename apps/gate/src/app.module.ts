import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from './settings/configuration';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './users/users.module';
import { SignupModule } from './signup/signup.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { BusinessModule } from './business/business.module';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = [
    'apps/gate/src/.env.development',
    'apps/gate/src/.env',
  ];
  if (env === EnvironmentMode.TESTING) {
    return ['apps/gate/src/.env.test', ...defaultEnvFilePath];
  }

  return defaultEnvFilePath;
};

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      ignoreEnvFile:
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
        process.env.NODE_ENV !== EnvironmentMode.TESTING,
      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    UsersModule,
    PostsModule,
    // FIXME move on external module mb// CRUSH GATE IF USERS SERVICE IS NOT WORKING
    // GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
    //   driver: ApolloGatewayDriver,
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => ({
    //     server: {
    //       path: '/api/v1/graphql',
    //       context: ({ req }) => ({ headers: req.headers }),
    //     },
    //     gateway: {
    //       supergraphSdl: new IntrospectAndCompose({
    //         subgraphs: [
    //           {
    //             name: 'users',
    //             url:
    //               config.get('NODE_ENV') === 'DEVELOPMENT'
    //                 ? `http://localhost:${config.get('USERS_PORT')}/api/v1/graphql`
    //                 : `${config.get('USERS_PROD_SERVICE_URL')}/api/v1/graphql`,
    //           },
    //           // add new subgraphs
    //         ],
    //         pollIntervalInMs: 5000,
    //         subgraphHealthCheck: true,
    //       }),
    //       buildService({ url }) {
    //         return new RemoteGraphQLDataSource({
    //           url,
    //           willSendRequest({ request, context }) {
    //             // FIXME add validate
    //             // console.log(request);
    //             if (context.headers) {
    //               if (context.headers) {
    //                 console.log(context.headers);
    //                 console.log('ok');
    //                 request.http.headers.set(
    //                   'Authorization',
    //                   context.authToken,
    //                 );
    //               } else {
    //                 throw new ForbiddenException({ message: 'Token?0_o' });
    //               }
    //             }
    //           },
    //         });
    //       },
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    SignupModule,
    AuthModule,
    BusinessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

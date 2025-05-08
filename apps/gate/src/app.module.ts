import { ForbiddenException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfiguration } from './settings/configuration';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { GateService } from '../../libs/gateService';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
    }),
    // FIXME move on external module mb
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
    //             console.log(request);
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
  ],
  controllers: [AppController],
  providers: [AppService, GateService],
})
export class AppModule {}

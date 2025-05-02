import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { applyAppSettings } from './settings/main.settings';
import { useContainer } from 'class-validator';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverConfig,
  ApolloGatewayDriver,
  ApolloGatewayDriverConfig,
} from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'https://yogram.ru',
      'http://localhost:5173',
      'https://localhost:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  });
  // GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
  //   driver: ApolloGatewayDriver,
  //   server: {
  //     sortSchema: true,
  //     playground: true, // GraphQL UI
  //   },
  //   gateway: {
  //     supergraphSdl: new IntrospectAndCompose({
  //       subgraphs: [
  //         { name: 'users', url: 'http://localhost:3864/api/v1/graphql' },
  //         // Добавьте другие сервисы здесь
  //       ],
  //       pollIntervalInMs: 5000,
  //     }),
  //   },
  // });
  const { port, env } = applyAppSettings(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.init();
  await app.listen(port, () => {
    console.log('App starting service GATE listen port: ', port, 'ENV: ', env);
  });
}
bootstrap();

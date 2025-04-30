import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from './settings/main.settings';
import { UsersModule } from './users.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  const { port, env, host } = applyAppSettings(app);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  });
  // useContainer(app.select(UsersModule), { fallbackOnErrors: true });

  await app.startAllMicroservices();
  console.log('App starting service GATE listen port: ', port, 'ENV: ', env);
}
bootstrap();

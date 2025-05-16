import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from './settings/main.settings';

import { useContainer } from 'class-validator';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  const { port, env, host } = applyAppSettings(app);

  useContainer(app.select(UsersModule), { fallbackOnErrors: true });

  await app.listen(port);
  console.log('App starting service USERS listen port: ', port, 'ENV: ', env);
}
bootstrap();

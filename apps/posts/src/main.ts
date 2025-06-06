import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from './settings/main.settings';

import { useContainer } from 'class-validator';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port, env, host } = applyAppSettings(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  console.log('posts');
  await app.listen(port);
  console.log('App starting service POSTS listen port: ', port, 'ENV: ', env);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from './settings/main.settings';

import { useContainer } from 'class-validator';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const { port, env, host } = applyAppSettings(app);
  app.useBodyParser('json', { limit: '150mb' });
  app.useBodyParser('urlencoded', { limit: '150mb', extended: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port);
  console.log('App starting service POSTS listen port: ', port, 'ENV: ', env);
}
bootstrap();

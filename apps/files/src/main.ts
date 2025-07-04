import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { useContainer } from 'class-validator';
import { applyAppSettings } from './settings/main.settings';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { port, env, host } = applyAppSettings(app);
  app.useBodyParser('json', { limit: '150mb' });
  app.useBodyParser('urlencoded', { limit: '150mb', extended: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.port ?? 3005);
  console.log('App starting service FILES listen port: ', port, 'ENV: ', env);
}
bootstrap();

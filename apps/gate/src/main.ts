import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { applyAppSettings } from './settings/main.settings';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.useBodyParser('json', { limit: '150mb' });
  app.useBodyParser('urlencoded', {
    limit: '150mb',
    parameterLimit: 5000,
    extended: true,
  });
  // todo! try cors origin: * and app.set('trust proxy', true);
  // app.set('trust proxy', true);
  app.enableCors({
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Content-Type',
      'Authorization',
      'Content-Length',
      'Host',
      'Accept',
      'Accept-Encoding',
      'Connection',
      'User-Agent',
      'x-recaptcha-token',
    ],
    exposedHeaders: ['Set-cookie'],

    origin: [
      'https://yogram.ru',
      'http://localhost:5173',
      'http://localhost:56938',
      'https://localhost:3000',
      'http://localhost:3000',
      'http://localhost',
      '*',
    ],
    credentials: true,
  });

  const { port, env } = applyAppSettings(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.init();
  await app.listen(port, () => {
    console.log('App starting service GATE listen port: ', port, 'ENV: ', env);
  });
}
bootstrap();

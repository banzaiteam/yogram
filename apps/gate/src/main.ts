import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { applyAppSettings } from './settings/main.settings';
import { useContainer } from 'class-validator';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(bodyParser.json());

  app.enableCors({
    origin: [
      'https://yogram.ru',
      'http://localhost:5173',
      'http://localhost:56938',
      'https://localhost:3000',
      'http://localhost:3000',
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

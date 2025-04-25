import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { applyAppSettings } from './settings/main.settings';
import { useContainer } from 'class-validator';

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
  const { port, env } = applyAppSettings(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, () => {
    console.log('App starting service GATE listen port: ', port, 'ENV: ', env);
  });
}
bootstrap();

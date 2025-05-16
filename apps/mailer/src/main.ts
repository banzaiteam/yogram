import { NestFactory } from '@nestjs/core';
import { MailerModule } from './mailer.module';
import { applyAppSettings } from './settings/main.settings';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(MailerModule);
  const { port, env, host } = applyAppSettings(app);

  useContainer(app.select(MailerModule), { fallbackOnErrors: true });

  await app.listen(port);
  console.log('App starting service USERS listen port: ', port, 'ENV: ', env);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { BusinessModule } from './business.module';
import { useContainer } from 'class-validator';
import { applyAppSettings } from './settings/main.settings';

async function bootstrap() {
  const app = await NestFactory.create(BusinessModule);
  const { port, env, host } = applyAppSettings(app);

  useContainer(app.select(BusinessModule), { fallbackOnErrors: true });

  await app.listen(port);
  console.log(
    'App starting service BUSINESS listen port: ',
    port,
    'ENV: ',
    env,
  );
}
bootstrap();

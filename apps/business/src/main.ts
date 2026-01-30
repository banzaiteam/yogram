import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { applyAppSettings } from './settings/main.settings';
import { BusinessModule } from './business.module';
import { WsAuthAdapter } from 'apps/libs/common/notifications/ws-auth.adapter';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(BusinessModule);
  const { port, env, host } = applyAppSettings(app);

  useContainer(app.select(BusinessModule), { fallbackOnErrors: true });
  const jwtService = app.get(JwtService);

  // app.useWebSocketAdapter(new WsAuthAdapter(jwtService, app));

  await app.listen(port);
  console.log(
    'App starting service BUSINESS listen port: ',
    port,
    'ENV: ',
    env,
  );
}
bootstrap();

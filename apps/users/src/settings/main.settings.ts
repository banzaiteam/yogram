import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { EnvironmentsTypes } from './configuration';
import { HttpExceptionFilter } from './exeption.filter';

const APP_PREFIX = '/api/v1';

export const applyAppSettings = (
  app: INestApplication,
): { port: number; env: string; host: string } => {
  const { port, env, host } = getEnv(app);

  setAppPrefix(app, APP_PREFIX);

  setSwagger(app, APP_PREFIX);

  setAppPipes(app);

  setAppExceptionsFilters(app);
  return { port, env, host };
};

const getEnv = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const env = configService.get<EnvironmentsTypes>('NODE_ENV');
  const host = '0.0.0.0';
  return { port, env, host };
};

const setAppPrefix = (app: INestApplication, prefix: string) => {
  app.setGlobalPrefix(prefix);
};

const setSwagger = (app: INestApplication, prefix: string) => {
  // if (env !== EnvironmentMode.PRODUCTION) {
  const swaggerPath = prefix + '/swagger';

  const config = new DocumentBuilder()
    .setTitle('YoGram')
    .setDescription('API for control YoGram')
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'YoGram Swagger',
  });
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = [];
        console.log(errors, 'pipe');
        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);
          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey];
            customErrors.push({ field: e.property, message: msg });
          });
        });

        throw new BadRequestException(customErrors);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};

class IntervalRunner {
  intervalId: NodeJS.Timeout;
  isRunning: boolean;
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
  }

  start(func, interval = 5000, immediateFirstCall = false) {
    if (this.isRunning) return;

    this.isRunning = true;

    if (immediateFirstCall) {
      func();
    }

    this.intervalId = setInterval(() => {
      func();
    }, interval);
  }

  stop() {
    if (!this.isRunning) return;

    clearInterval(this.intervalId);
    this.isRunning = false;
    this.intervalId = null;
  }

  // Проверить статус выполнения
  get status() {
    return this.isRunning ? 'running' : 'stopped';
  }
}

export const intervalRunner = new IntervalRunner();

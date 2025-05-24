import { Module } from '@nestjs/common';
import { MailerController } from './api/mailer.controller';
import { MailService } from './mailer.service';
import { MailerModule as MaileRModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  EnvironmentMode,
  EnvironmentsTypes,
  getConfiguration,
} from './settings/configuration';
import { JwtModule } from '@nestjs/jwt';
import { SendUserVerifyEmailCommand } from './features/verifyEmail/command/send-user-verify-email.command';
import { SendUserVerifyEmailHandler } from './features/verifyEmail/command/send-user-verify-email.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersBindingKeysEnum } from 'apps/users/src/message-brokers/rabbit/users-queue-bindings.constant';
import { RabbitConsumerModule } from 'apps/libs/common/message-brokers/rabbit/rabbit-consumer.module';
import { MailerBindingKeysEnum } from 'apps/libs/Mailer/constants';
import { SendEmailCommand } from './features/sendEmail/command/send-email.command';
import { SendEmailHandler } from './features/sendEmail/command/send-email.handler';

const getEnvFilePath = (env: EnvironmentsTypes) => {
  const defaultEnvFilePath = [
    'apps/mailer/src/.env.development',
    'apps/mailer/src/.env',
  ];
  console.log('getEnvFilePath MAILER');

  if (env === EnvironmentMode.TESTING) {
    return ['apps/mailer/src/.env.test', ...defaultEnvFilePath];
  }
  return defaultEnvFilePath;
};

@Module({
  imports: [
    CqrsModule,
    RabbitConsumerModule.register([
      { users: [UsersBindingKeysEnum.Users_Verify_One] },
      { mailer: [MailerBindingKeysEnum.SendEmailOne] },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      ignoreEnvFile:
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
        process.env.NODE_ENV !== EnvironmentMode.TESTING,
      envFilePath: getEnvFilePath(process.env.NODE_ENV as EnvironmentsTypes),
    }),
    MaileRModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.FROM_EMAIL,
      },
    }),
  ],
  controllers: [MailerController],
  providers: [
    SendEmailCommand,
    SendEmailHandler,
    MailService,
    SendUserVerifyEmailCommand,
    SendUserVerifyEmailHandler,
  ],
})
export class MailerModule {}

import { Module } from '@nestjs/common';
import { MailerController } from './api/mailer.controller';
import { MailService } from './mailer.service';
import { MailerModule as MaileRModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
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
  providers: [MailService],
})
export class MailerModule {}

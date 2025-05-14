import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IMailer } from './interfaces/Mailer.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';

@Injectable()
export class MailService implements IMailer {
  constructor(private readonly mailerService: MailerService) {}
  async sendUserVerifyEmail(userVerifyEmailDto: UserVerifyEmailDto) {
    const subject = 'Yogram account verification';

    // get from onfigService
    const html = `<p>Hello ${userVerifyEmailDto.username},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>please click on the activation link <a href=https://gate.yogram.ru/api/v1/auth/email-verify/${userVerifyEmailDto.token}>verify link</a></p>`;

    try {
      const result = await this.mailerService.sendMail({
        ...userVerifyEmailDto,
        html,
        subject,
      });
      return result.envelope;
    } catch (err) {
      throw new RpcException('User verification email was not sent');
    }
  }
}

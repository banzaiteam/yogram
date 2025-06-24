import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IMailer } from './interfaces/Mailer.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService implements IMailer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserVerifyEmail(userVerifyEmailDto: UserVerifyEmailDto) {
    const payload = { email: userVerifyEmailDto.to };
    const expiresIn = parseInt(this.configService.get('VERIFY_TOKEN_EXPIRES'));
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expiresIn / 1000,
    });
    let path: string;
    if (process.env.NODE_ENV !== undefined) {
      path = 'http://localhost:3000';
    } else {
      path = 'https://gate.yogram.ru';
    }
    const subject = 'Yogram account verification';
    const html = `<p>Hello ${userVerifyEmailDto.username},</p>
        <p>Welcome to our community! You created account but it still need to be verified.</p>
        <p>please click on the activation link <a href=${path}/api/v1/signup/email-verify/${token}>verify link</a></p>`;
    try {
      const result = await this.mailerService.sendMail({
        ...userVerifyEmailDto,
        html,
        subject,
      });
      return result.envelope;
    } catch (err) {
      console.log(err);
      throw new RpcException('User verification email was not sent');
    }
  }
}

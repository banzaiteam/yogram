import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';

export interface IMailer {
  sendUserVerifyEmail(userVerifyEmailDto: UserVerifyEmailDto): Promise<object>;
}

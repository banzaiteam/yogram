import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';

export class SendUserVerifyEmailCommand {
  constructor(public readonly userVerifyEmailDto: UserVerifyEmailDto) {}
}

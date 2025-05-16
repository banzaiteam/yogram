import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';

export class SendVerifyEmailEvent {
  constructor(public userVerifyEmailDto: UserVerifyEmailDto) {}
}

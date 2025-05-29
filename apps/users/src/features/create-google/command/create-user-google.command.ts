import { GoogleSignupDto } from 'apps/libs/Users/dto/user/google-signup.dto';

export class CreateUserGoogleCommand {
  constructor(public readonly googleSignupDto: GoogleSignupDto) {}
}

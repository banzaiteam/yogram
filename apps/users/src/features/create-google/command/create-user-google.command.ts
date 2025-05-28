import { GoogleSignupDto } from 'apps/libs/Users/dto/user/google-signup.dto';
import { Response } from 'express';

export class CreateUserGoogleCommand {
  constructor(
    public readonly googleSignupDto: GoogleSignupDto,
    public readonly res: Response,
  ) {}
}

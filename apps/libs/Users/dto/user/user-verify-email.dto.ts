import { IsEmail, IsString } from 'class-validator';

export class UserVerifyEmailDto {
  @IsString()
  username: string;
  @IsEmail()
  to: string;
}

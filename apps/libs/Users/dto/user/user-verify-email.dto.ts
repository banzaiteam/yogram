import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UserVerifyEmailDto {
  @IsUUID()
  username: string;
  @IsEmail()
  to: string;
  @IsString()
  token: string;
}

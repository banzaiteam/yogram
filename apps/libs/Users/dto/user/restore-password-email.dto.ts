import { IsEmail, IsString } from 'class-validator';

export class RestorePasswordEmailDto {
  @IsEmail()
  to: string;
  @IsString()
  username: string;
  @IsString()
  template: string;
  @IsString()
  subject: string;
}

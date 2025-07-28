import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MergeProviderUserDto } from './merge-provider-user.dto';

export class GoogleSignupDto {
  @IsString()
  providerId: string;
  @IsString()
  @IsOptional()
  username?: string;
  @IsEmail()
  email: string;
  @IsOptional()
  // @ValidateNested()
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

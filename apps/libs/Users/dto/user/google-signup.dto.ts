import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MergeProviderUserDto } from './merge-provider-user.dto';

export class GoogleSignupDto {
  @IsString()
  providerId: string;
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsOptional()
  @ValidateNested()
  user?: MergeProviderUserDto;
}

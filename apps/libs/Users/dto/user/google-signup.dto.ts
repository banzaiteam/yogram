import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MergeProviderUserDto } from './merge-provider-user.dto';
import { Type } from 'class-transformer';

export class GoogleSignupDto {
  @Type(() => Number)
  @IsNumber()
  providerId: number;
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsOptional()
  @ValidateNested()
  user?: MergeProviderUserDto;
}

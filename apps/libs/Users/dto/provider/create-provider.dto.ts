import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OauthProviders } from '../../constants/oauth-providers.enum';
import { User } from 'apps/users/src/infrastructure/entity/User.entity';

export class CreateProviderDto {
  @IsOptional()
  @IsString()
  providerId?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsEnum({ enum: OauthProviders })
  type?: OauthProviders;
  @IsOptional()
  user?: User;
}

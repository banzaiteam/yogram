import { IsOptional, IsString } from 'class-validator';

export class FindUserByCriteriaDto {
  @IsOptional()
  @IsString()
  id?: string;
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsString()
  providerId?: string;
}

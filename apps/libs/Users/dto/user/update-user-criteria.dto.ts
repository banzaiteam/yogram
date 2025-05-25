import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserCriteria {
  @IsOptional()
  @IsUUID()
  id?: string;
  @IsOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsOptional()
  @IsString()
  username?: string;
}

import { IsArray, IsOptional, IsString } from 'class-validator';

export class LogoutAllDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[];
}

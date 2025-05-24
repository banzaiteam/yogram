import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FindUserByCriteriaDto {
  @IsOptional()
  @IsString()
  id?: string;
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  // @IsBoolean()
  // verified?: boolean;
  @IsOptional()
  @IsString()
  email?: string;
}

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  likes?: number;
  @IsString()
  @IsOptional()
  text?: string;
}

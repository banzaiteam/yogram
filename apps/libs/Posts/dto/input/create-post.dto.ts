import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, isString, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  description: string;
  @IsOptional()
  userId?: string;
}

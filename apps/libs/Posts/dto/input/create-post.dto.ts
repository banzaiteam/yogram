import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  description: string;
  @IsOptional()
  userId?: string;
}

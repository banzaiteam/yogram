import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  userId?: string;
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  postId?: string;
}

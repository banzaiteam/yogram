import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['postId', 'userId']),
) {
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
  @IsOptional()
  @IsString()
  url?: string;
}

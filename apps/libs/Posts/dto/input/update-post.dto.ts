import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FileStatus } from '../../../../../apps/posts/src/features/posts/constants/file.constant';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['postId', 'userId']),
) {
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
  @IsOptional()
  @IsString()
  url?: string;
  @IsOptional()
  @IsEnum({ enum: FileStatus })
  status?: FileStatus;
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @MinLength(20)
  description?: string;
}

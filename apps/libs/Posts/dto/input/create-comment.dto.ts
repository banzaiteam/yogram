import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Post } from '../../../../../apps/posts/src/features/posts/infrastracture/entity/post.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsUUID()
  postId: string;
  @ApiHideProperty()
  @IsOptional()
  userId?: string;
  @IsString()
  @MinLength(1, { message: 'comment should be not less than 1 characters' })
  @MaxLength(300, {
    message: 'comment should be not longer than 300 characters',
  })
  text: string;
  @IsUUID()
  @IsOptional()
  parentId?: string;
  @ApiHideProperty()
  post: Post;
  @ApiHideProperty()
  likes = 0;
}

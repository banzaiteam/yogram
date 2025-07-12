import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ResponsePostDto } from '../output/response-post.dto';
import { ResponseCommentDto } from '../output/response-comment.dto';
import { Post } from 'apps/posts/src/features/posts/infrastracture/entity/post.entity';

export class CreateCommentDto {
  @IsUUID()
  postId: string;
  // @ApiHideProperty()
  @IsUUID()
  userId: string;
  @IsString()
  @MinLength(2, { message: 'comment should be not less than 2 characters' })
  @MaxLength(300, {
    message: 'comment should be not longer than 300 characters',
  })
  text: string;
  @IsUUID()
  @IsOptional()
  parentId?: string;
  // @ApiHideProperty()
  // @Type(() => Post)
  post: Post;
  // @ApiHideProperty()
  // @Type(() => Comment)
  // parentComment?: Comment;

  likes = 0;
}

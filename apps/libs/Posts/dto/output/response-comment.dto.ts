import { OmitType } from '@nestjs/swagger';
import { Comment } from '../../../../../apps/posts/src/features/posts/infrastracture/entity/comment.entity';

export class ResponseCommentDto extends OmitType(Comment, [
  'deletedAt',
  'post',
  'parent',
]) {}

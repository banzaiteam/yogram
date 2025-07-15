import { ResponseCommentDto } from './response-comment.dto';

export class CommentPaginatedResponseDto {
  items: ResponseCommentDto[];
  totalItems: number;
  page: number;
  limit: number;
}

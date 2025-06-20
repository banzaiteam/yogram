import { ResponsePostDto } from './response-post.dto';

export class PostPaginatedResponseDto {
  items: ResponsePostDto[];
  totalItems: number;
  page: number;
  limit: number;
}

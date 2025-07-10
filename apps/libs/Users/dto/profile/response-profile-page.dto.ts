import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { ResponseUserDto } from '../user/response-user.dto';

export class ResponseProfilePageDto {
  user: ResponseUserDto;
  posts: PostPaginatedResponseDto;
}

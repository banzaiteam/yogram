import { IPaginatedResponse } from 'apps/libs/common/pagination/interface/Pagination-response.interface';
import { ResponsePostDto } from './response-post.dto';

export class PostPaginatedResponseDto extends IPaginatedResponse<ResponsePostDto> {}

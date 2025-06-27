import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PostPaginatedResponseDto } from '../../../../../../apps/libs/Posts/dto/output/post-paginated-reponse.dto';

export const GetSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 200,
      type: PostPaginatedResponseDto,
      isArray: true,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'string',
      example: 'limit=8',
      default: 8,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'string',
      example: 'page=1',
      default: 1,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: 'string',
      format: 'field:asc|desc',
      example: 'createdAt:asc',
      default: null,
    }),
    ApiQuery({
      name: 'filter',
      required: false,
      type: 'string',
      format: 'field:operator:value',
      example: 'userId:eq:1',
      description: 'allowed operators eq(equel), neq(notequel)',
      default: null,
    }),
    ApiOperation({
      description:
        'api/v1/posts/page=2&limit=9&sort=createdAt:desc&filter=userId:eq:2',
      summary:
        'find and sort posts by filter parameter(isPublished | userId) and sort parameter(createdAt | isPublished). Return paginated array',
    }),
  );

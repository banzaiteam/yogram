import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { ResponseProfilePageDto } from 'apps/libs/Users/dto/profile/response-profile-page.dto';

export const GetSwagger = () =>
  applyDecorators(
    ApiResponse({
      status: 200,
      type: ResponseProfilePageDto,
      isArray: true,
    }),
    ApiParam({
      name: 'id',
      type: 'uuid',
      example: 'fcf770ce-12e5-40b6-9ffa-5b987492eb8a',
      description: 'user id',
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
    ApiOperation({
      description:
        'api/v1/users/fcf770ce-12e5-40b6-9ffa-5b987492eb8a/profile/posts',
      summary:
        'return all user information with avatar url and all posts with photos urls',
    }),
  );

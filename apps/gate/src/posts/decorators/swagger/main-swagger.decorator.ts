import { applyDecorators } from '@nestjs/common';
import { ResponsePostsMainPage } from '../../../../../../apps/libs/Posts/dto/output/response-posts-main-page.dto';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const MainSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      required: false,
      description: ' Authorization with bearer token, not required',
    }),
    ApiResponse({
      status: 200,
      type: ResponsePostsMainPage,
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
    ApiOperation({
      description: 'api/v1/posts/main?page=2&limit=9',
      summary:
        'Get main page info. If user is guest than gets only paginated posts and users amount. If user is authorized than aditionally gets his subscriptions info',
    }),
  );

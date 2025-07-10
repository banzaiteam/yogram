import { applyDecorators } from '@nestjs/common';
import { ApiHeaders, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const CancelPostSwagger = () =>
  applyDecorators(
    ApiHeaders([
      {
        name: 'Authorization',
        description: 'Authorization with bearer token',
      },
    ]),
    ApiResponse({ status: 200 }),
    ApiResponse({
      status: 500,
      description:
        'PostCommandService: post ${postId} was not deleted or not exists',
    }),
    ApiOperation({
      description:
        'delete post with related files during post uploading. To get userId and postId call /posts/sse-cancel-token',
      summary: 'cancel post uploading',
    }),
  );

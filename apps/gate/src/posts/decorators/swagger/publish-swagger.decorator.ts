import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const PublishSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 200,
      description: 'success',
    }),
    ApiResponse({
      status: 404,
      description: 'post not found',
    }),
    ApiOperation({
      summary: ' publish post during post creation',
      description:
        ' call when photos was uploaded and need to publish new post with or without description',
    }),
  );

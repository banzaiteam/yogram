import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';

export const DeleteSwagger = () =>
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
      status: 500,
      description:
        'PostCommandService: post ${postId} was not deleted or not exists',
    }),
  );

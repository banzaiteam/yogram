import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';

export const UpdateSwagger = () =>
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
    ApiResponse({
      status: 400,
      description: 'post description should not be more than 500 symbols',
    }),
  );

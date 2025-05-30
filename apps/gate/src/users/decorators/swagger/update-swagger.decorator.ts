import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function UpdateSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary:
        'Find user by id | email | username and update it. If update by email/username automatically update provider',
    }),
    HttpCode(HttpStatus.OK),
    ApiResponse({ status: 200, description: 'user updated' }),
    ApiResponse({ status: 404, description: 'user not found' }),
  );
}

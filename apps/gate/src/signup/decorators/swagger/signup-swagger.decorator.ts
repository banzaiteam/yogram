import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SignUpSwagger() {
  return applyDecorators(
    ApiResponse({ status: 201, description: 'user was created' }),
    ApiResponse({
      status: 409,
      description: 'user with this email/username already exists',
    }),
    ApiOperation({
      summary: 'New user registration',
    }),
  );
}

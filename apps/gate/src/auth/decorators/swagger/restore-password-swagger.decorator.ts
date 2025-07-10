import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function RestorePasswordSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'save new password and redirect to the login page',
      description:
        'call when user entered new password. User email is in the email url',
    }),
    ApiResponse({
      status: 200,
      description: 'user`s password was updated successfully',
    }),
    ApiResponse({
      status: 500,
      description: 'user password was not updated',
    }),
    ApiResponse({
      status: 404,
      description: 'user was not found',
    }),
    HttpCode(HttpStatus.OK),
  );
}

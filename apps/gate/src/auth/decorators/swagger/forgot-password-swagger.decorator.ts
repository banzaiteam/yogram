import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ForgotPasswordSwagger() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'email was sent succesfully',
    }),
    ApiResponse({
      status: 401,
      description: 'user with this email was not found',
    }),
    ApiResponse({
      status: 500,
      description: 'forgot password email was not sent',
    }),
    ApiOperation({
      summary: 'Send forgotPassword email to the user email',
      description: 'call when user entered email on forgotPassword page',
    }),
    HttpCode(HttpStatus.OK),
  );
}

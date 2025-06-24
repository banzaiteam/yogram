import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function SendVerifyEmailSwagger() {
  return applyDecorators(
    ApiParam({ name: 'email', type: 'string' }),
    ApiOperation({
      description:
        'if token is expired will redirect to the page looks like https://yogram.ru/signup/email-verify/:email',
      summary: 'Send verify email on the user request',
    }),
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      description: 'ok email was sent',
    }),
    ApiResponse({
      status: 404,
      description: 'user was not found',
    }),
    ApiResponse({
      status: 400,
      description: 'user is already verified',
    }),
    ApiResponse({
      status: 500,
      description: 'verify email was not sent',
    }),
  );
}

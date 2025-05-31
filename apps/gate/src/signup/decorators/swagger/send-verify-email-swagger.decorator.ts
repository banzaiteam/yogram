import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailDto } from '../../../../../../apps/libs/Users/dto/user/email.dto';

export function SendVerifyEmailSwagger() {
  return applyDecorators(
    ApiBody({ type: EmailDto }),
    ApiOperation({
      summary: 'Send verify email on user request',
    }),
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

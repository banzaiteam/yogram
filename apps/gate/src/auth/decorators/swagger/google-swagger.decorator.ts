import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GoogleSwagger() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({
      headers: {
        'Set-Cookie': {
          description: 'access_token without httpOnly/refresh_token httpOnly',
          schema: { type: 'string' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'user was not created/logged in',
    }),
    ApiOperation({
      summary: 'Signup/login with google',
      description:
        'if user didnt register with form, usual user account will be created and logged in. If user have form registered account, he will be logged in',
    }),
  );
}

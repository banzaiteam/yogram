import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GoogleSwagger() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({
      headers: {
        'Set-Cookie': {
          description: 'sameSite, secure, httpOnly refreshToken',
          schema: { type: 'string' },
        },
      },
      content: {
        ApiResponse: {
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI2NTAwNGQ2LTc5MzQtNGRkNS04MDAxLWJhYWFkN2I0MmIzYiIsImlhdCI6MTc0OTQxMzA1NCwiZXhwIjoxNzQ5NDEzMjk0fQ.I50Lao0A1Tic4Npfaf8620SzNJvFfNjgO-_AvMkvNa0',
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
        'if user didnt register with form, usual user account will be created and logged in then create password for form account link will be sent to the user mail. If user have form registered account, he will be logged in',
    }),
  );
}

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LoggedUserDto } from '../../../../../../apps/libs/Users/dto/user/logged-user.dto';
import { LoginDto } from '../../../../../../apps/libs/Users/dto/user/login.dto';

export function LoginSwagger() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description: ' return set-cookie refresh token and accessToken in body',
      headers: {
        'Set-Cookie': {
          description: 'refresh_token httpOnly, secure, samesite',
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
      status: 401,
      description: 'invalid login/password or not verified',
    }),
    ApiResponse({
      status: 404,
      description: 'user does not exist',
    }),
  );
}

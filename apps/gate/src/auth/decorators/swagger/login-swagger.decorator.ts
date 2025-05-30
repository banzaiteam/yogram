import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LoggedUserDto } from '../../../../../../apps/libs/Users/dto/user/logged-user.dto';
import { LoginDto } from '../../../../../../apps/libs/Users/dto/user/login.dto';

export function LoginSwagger() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      headers: {
        'Set-Cookie': {
          description: 'access_token without httpOnly/refresh_token httpOnly',
          schema: { type: 'string' },
        },
      },
      type: LoggedUserDto,
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

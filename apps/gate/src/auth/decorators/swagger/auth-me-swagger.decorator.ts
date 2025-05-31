import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoggedUserDto } from 'apps/libs/Users/dto/user/logged-user.dto';

export function AuthMeSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    HttpCode(HttpStatus.OK),
    ApiOkResponse({
      type: LoggedUserDto,
    }),
    ApiOperation({
      summary: 'Get user data',
    }),
    ApiResponse({
      status: 404,
      description: 'user was not found',
    }),
  );
}

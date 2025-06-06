import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogoutAllDto } from '../../dto/logout-all.dto';

export function LogoutSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 200,
      description: 'success',
    }),
    ApiBody({ type: LogoutAllDto, isArray: true }),
    ApiResponse({
      status: 500,
      description: 'Session provider: logout problem',
    }),
    ApiResponse({
      status: 404,
      description:
        'Session provider: not valid token in tokens array on logout',
    }),
    ApiOperation({
      summary: 'Logout specific device or all devices except active',
      description:
        'Need left body empty and pass refresh token to authorization header if you want logout current device or pass to body refresh tokens array which should be logout and pass active device refresh token to authorization header',
    }),
  );
}

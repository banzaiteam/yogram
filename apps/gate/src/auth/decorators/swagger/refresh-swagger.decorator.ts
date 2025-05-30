import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function RefreshSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Get new access token',
    }),
    ApiOkResponse({
      headers: {
        'Set-Cookie': {
          description: 'access_token',
          schema: { type: 'string' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Not Unauthorized',
    }),
  );
}

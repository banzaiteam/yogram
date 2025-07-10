import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function RefreshSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get new access token',
    }),
    ApiHeader({
      required: true,
      name: 'refreshToken in cookies',
    }),
    ApiOkResponse({
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJhNDA4MmY2LTBlNzMtNDhiYS1hMWJhLTFmODRjMzNmMTQwNSIsImlhdCI6MTc1MDc3MDY0NywiZXhwIjoxNzUwNzcwNzA3fQ.mC859lF1YXUaXpjFsTNoyBRyxun9FBQ_8kWtt7F_6N8',
      description: 'return accessToken',
    }),
    ApiResponse({
      status: 401,
      description: '"RefreshGuard: expired/invalid token"',
    }),
  );
}

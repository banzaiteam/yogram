import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';

export function FindUserByCriteriaSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find one user by id, email, username or providerId',
    }),
    ApiResponse({
      status: 200,
      description: 'user found',
      type: ResponseUserDto,
    }),
    ApiResponse({ status: 404, description: 'user not found' }),
    ApiQuery({ name: 'id', required: false, type: 'string' }),
    ApiQuery({ name: 'email', required: false, type: 'string' }),
    ApiQuery({ name: 'username', required: false, type: 'string' }),
    ApiQuery({ name: 'providerId', required: false, type: 'string' }),
  );
}

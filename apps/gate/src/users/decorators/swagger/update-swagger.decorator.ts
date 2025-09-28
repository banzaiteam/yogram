import { UpdateUserDto } from '../../../../../../apps/libs/Users/dto/user/update-user.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';

export function UpdateSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary:
        'Find user by id | email | username and update it. If update by email/username automatically update provider',
    }),
    ApiBody({
      type: UpdateUserDto,
    }),
    HttpCode(HttpStatus.OK),
    ApiResponse({ status: 200, description: 'user updated' }),
    ApiResponse({ status: 404, description: 'user not found' }),
  );
}

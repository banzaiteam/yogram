import { UpdateUserDto } from '../../../../../../apps/libs/Users/dto/user/update-user.dto';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function UpdateSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiConsumes('multipart/form-data'),
    ApiOperation({
      summary:
        'Find user by id | email | username and update it. If update by email/username automatically update provider',
      description:
        'to update any of user properties pass object UpdateUserDto with properties, example: UpdateUserDto: {"birthdate": "10.10.2000", "city":"City"}',
    }),
    ApiBody({
      type: UpdateUserDto,
    }),
    HttpCode(HttpStatus.OK),
    ApiResponse({ status: 200, description: 'user updated' }),
    ApiResponse({ status: 404, description: 'user not found' }),
  );
}

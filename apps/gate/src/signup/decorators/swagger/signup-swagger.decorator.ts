import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../../../../../apps/libs/Users/dto/user/create-user.dto';

export function SignUpSwagger() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: CreateUserDto,
    }),
    ApiResponse({ status: 201, description: 'user was created' }),
    ApiResponse({
      status: 409,
      description: 'user with this email | username already exists',
    }),
    ApiOperation({
      summary: 'New user registration',
    }),
  );
}

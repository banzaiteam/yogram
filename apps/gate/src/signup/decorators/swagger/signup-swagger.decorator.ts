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
      description:
        'user with this email already exists | user with this username already exists',
    }),
    ApiOperation({
      summary: 'New user registration with optional avatar uploading(20mb max)',
      description:
        'You need to listen SSE via https://gate.yogram.ru/api/v1/users/sse-avatar to get created user object with url after avatar will be uploaded. All errors will be returned by usual http response.',
    }),
  );
}

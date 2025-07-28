import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const DeleteAvatarSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Delete user`s avatar',
      description:
        'Delete current or previously uploaded avatars. Firstly get all user`s avatars then pass avatar url as query parameter',
    }),
    ApiQuery({
      name: 'url',
      required: true,
      type: 'string',
      example:
        'url=https://yogram-files.s3.eu-north-1.amazonaws.com/dev/avatars/9296e233-f066-47d3-b24c-2fdb4600b82a/img45-1753269823992-211072577.jpeg',
    }),
    ApiResponse({
      status: 200,
    }),
    ApiResponse({
      status: 404,
      description: 'AwsService error: file was not found during delete',
    }),
  );

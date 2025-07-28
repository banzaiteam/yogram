import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const SwitchAvatarSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Switch user`s avatar',
      description:
        'change avatar to a previously uploaded one. Firstly get all user`s avatars then pass avatar url as body parameter',
    }),
    ApiBody({
      schema: {
        properties: {
          url: {
            type: 'string',
            example:
              'https://yogram-files.s3.eu-north-1.amazonaws.com/dev/avatars/9296e233-f066-47d3-b24c-2fdb4600b82a/img45-1753269823992-211072577.jpeg',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
    }),
  );

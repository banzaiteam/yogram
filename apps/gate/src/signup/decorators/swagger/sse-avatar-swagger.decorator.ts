import { applyDecorators } from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseFileDto } from '../../../../../../apps/libs/Posts/dto/output/response-file.dto';

export const SseAvatarSwagger = () =>
  applyDecorators(
    ApiHeaders([
      {
        name: 'Authorization',
        description: 'Authorization with bearer token',
      },
    ]),
    ApiResponse({
      type: ResponseFileDto,
    }),
    ApiResponse({
      status: 500,
      description:
        'Failed to connect to SSE endpoint | CORS error | Server unexpectedly closed the connection | Error: Invalid event stream data',
    }),
    ApiProduces('text/event-stream'),
    ApiOperation({
      description: 'call it and get avatar object when it will be uploaded',
      summary: 'return uploaded avatar object',
    }),
  );

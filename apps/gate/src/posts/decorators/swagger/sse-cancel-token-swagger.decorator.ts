import { applyDecorators } from '@nestjs/common';
import {
  ApiHeaders,
  ApiOperation,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { CancelUploadDto } from 'apps/libs/Posts/dto/input/cancel-upload.dto';

export const SseCancelTokenSwagger = () =>
  applyDecorators(
    ApiHeaders([
      {
        name: 'Authorization',
        description: 'Authorization with bearer token',
      },
    ]),
    ApiResponse({
      type: CancelUploadDto,
    }),
    ApiResponse({
      status: 500,
      description:
        'Failed to connect to SSE endpoint | CORS error | Server unexpectedly closed the connection | Error: Invalid event stream data',
    }),
    ApiProduces('text/event-stream'),
    ApiOperation({
      description:
        'call it when create new post to get {userId, postId} which could be used latter to cancel post uploading',
      summary: 'return {userId, postId} to call cancel post uploading',
    }),
  );

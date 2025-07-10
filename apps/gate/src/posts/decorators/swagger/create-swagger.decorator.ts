import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiHeaders,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

export const CreateSwagger = () =>
  applyDecorators(
    ApiHeaders([
      {
        name: 'Authorization',
        description: 'Authorization with bearer token',
      },
    ]),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: UploadPhoto }),
    ApiResponse({
      status: 201,
      description: 'post created',
    }),
    ApiResponse({
      status: 400,
      description:
        'PostsController error: cant create post, user`s account not verified',
    }),
    ApiResponse({
      status: 500,
      description:
        'PostCommandService error: post was not created because of database error | PostCommandService error: post was not created because of files upload error',
    }),
    ApiOperation({
      description:
        'create post, get uploaded photos one-by-one via SSE then enter or left empty post description, after call patch /posts/publish/{id} with optional body {description:"..."} to save and publish post. You need to listen SSE via https://gate.yogram.ru/api/v1/posts/sse-file to get uploaded photos objects one-by-one during paraller uploading. All errors will be returned by usual http response.',
      summary: 'upload a post with up to 10 photos(each 20mb max)',
    }),
  );

class UploadPhoto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The files array to upload',
  })
  files: any[];
}

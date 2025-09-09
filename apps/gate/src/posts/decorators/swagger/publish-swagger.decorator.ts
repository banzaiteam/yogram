import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  PickType,
} from '@nestjs/swagger';
import { UpdatePostDto } from 'apps/libs/Posts/dto/input/update-post.dto';
class DescriptionDto extends PickType(UpdatePostDto, ['description']) {}

export const PublishSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiBody({ type: DescriptionDto }),
    ApiResponse({
      status: 200,
      description: 'success',
    }),

    ApiResponse({
      status: 404,
      description: 'post not found',
    }),
    ApiOperation({
      summary: 'publish post during post creation',
      description:
        'call when photos was uploaded and need to publish new post with or without description',
    }),
  );

import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateCommentDto } from '../../../../../../apps/libs/Posts/dto/input/update-comment.dto';

export const UpdateCommentSwagger = () =>
  applyDecorators(
    ApiBody({ type: UpdateCommentDto }),
    ApiParam({
      name: 'id',
      type: 'uuid',
      example: 'fcf770ce-12e5-40b6-9ffa-5b987492eb8a',
      description: 'user id',
    }),
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 200,
    }),
    ApiResponse({
      status: 404,
      description: 'CommentCommandRepository error: comment was not found',
    }),
    ApiResponse({
      status: 500,
      description: 'CommentCommandService error: commentwas not updated',
    }),
    ApiOperation({
      summary: 'update post comment',
    }),
  );

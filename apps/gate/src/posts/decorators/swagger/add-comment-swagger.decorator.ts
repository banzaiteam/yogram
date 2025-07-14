import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCommentDto } from 'apps/libs/Posts/dto/input/create-comment.dto';

export const AddCommentSwagger = () =>
  applyDecorators(
    ApiBody({ type: CreateCommentDto }),
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 201,
    }),
    ApiResponse({
      status: 404,
      description:
        'CommentCommandService error: post does not exists | CommentCommandService error: parent comment does not exists',
    }),
    ApiOperation({
      summary: 'add comment to post',
      description: 'if you want add comment to comment enter the parentId',
    }),
  );

import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../use-cases/create-post';
import { CreatePostDto } from '../../../../../libs/Posts/dto/input/create-post.dto';

@Controller()
export class PostsController {
  constructor(private commandBus: CommandBus) { }

  @Post('posts/create')
  @ApiOperation({
    summary: 'Create a new post',
  })
  @ApiBody({
    description: 'Post data',
    schema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Post description text',
          example: 'This is my awesome post!',
        },
      },
    },
  })
  // @ApiConsumes('multipart/form-data')
  // @ApiResponse({
  //   status: 201,
  //   description: 'Post created successfully',
  //   type: PostViewModel,
  // })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async createPost(@Body() post: CreatePostDto) {
    console.log(JSON.stringify(post));
    // throw new ForbiddenException();
    if (!post.userId || !post.description) throw new BadRequestException();
    const result = await this.commandBus.execute(
      new CreatePostCommand(post.description, post.userId),
    );
    return result;
  }
}

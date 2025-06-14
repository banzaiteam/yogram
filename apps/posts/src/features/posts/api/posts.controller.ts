import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ChunksFileUploader } from 'apps/libs/common/upload/chunks-file-uploader.service';
import { ChunkedFileDto } from 'apps/libs/common/upload/dto/chunked-file.dto';
import { Request, Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { genFileName, getUploadPath } from 'apps/gate/src/posts/helper';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { CreatePostCommand } from '../use-cases/create-post';
import axios from 'axios';

@Controller()
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private readonly chunksFileUploader: ChunksFileUploader,
  ) {}

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
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          cb(
            null,
            await getUploadPath('apps/posts/src/features/posts/uploads', req),
          );
        },
        filename: (req, file, cb) => {
          cb(null, genFileName(file.originalname));
        },
      }),
    }),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    createPostDto.userId = <string>req.headers.userid;
    createPostDto.postId = req.body.postId;
    return await this.commandBus.execute(
      new CreatePostCommand(createPostDto, files),
    );
  }
}

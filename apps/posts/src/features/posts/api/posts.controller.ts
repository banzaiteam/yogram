import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ChunksFileUploader } from 'apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { genFileName, getUploadPath } from 'apps/gate/src/posts/helper';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { CreatePostCommand } from '../use-cases/commands/create-post.handler';
import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';
import { UpdatePostDto } from 'apps/libs/Posts/dto/input/update-post.dto';
import { UpdatePostCommand } from '../use-cases/commands/update-post.handler';
import { EventSubscribe } from 'apps/libs/common/message-brokers/rabbit/decorators/event-subscriber.decorator';
import { FilesRoutingKeys } from 'apps/files/src/features/files/message-brokers/rabbit/files-routing-keys.constant';
import { IEvent } from 'apps/libs/common/message-brokers/interfaces/event.interface';
import { FileStatus } from '../constants/file.constant';

@Controller()
export class PostsController {
  constructor(private commandBus: CommandBus) {}

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

  @Patch('posts/update')
  async update(
    @Body()
    payload: UpdatePostCriteria & UpdatePostDto,
  ): Promise<void> {
    const criteria = payload['criteria'];
    const updatePostDto = payload['updatePostDto'];
    return await this.commandBus.execute(
      new UpdatePostCommand(criteria, updatePostDto),
    );
  }

  @EventSubscribe({ routingKey: FilesRoutingKeys.FilesUploaded })
  async updateCreatedPost(rtKey: string, { payload }: IEvent): Promise<void> {
    let folderPath: string = <string>payload['folderPath'];
    folderPath = folderPath.substring(folderPath.lastIndexOf('/') + 1);
    const criteria = {
      id: folderPath,
      fileid: payload['fileId'],
    };
    const updatePostDto = { url: payload['url'], status: FileStatus.Ready };
    return await this.commandBus.execute(
      new UpdatePostCommand(criteria, updatePostDto),
    );
  }
}

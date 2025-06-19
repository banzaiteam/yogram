import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import {
  IPagination,
  PaginationParams,
} from 'apps/gate/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from 'apps/gate/common/pagination/decorators/sorting.decorator';
import {
  FilteringParams,
  IFiltering,
} from 'apps/gate/common/pagination/decorators/filtering.decorator';
import { GetPostsQuery } from '../use-cases/queries/get-posts.query';
import { SharpPipe } from 'apps/libs/common/pipes/sharp.pipe';

@Controller()
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
      // todo! not return error message because of stream response in gate/posts.controller
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 20000000,
            message: ' file is biiger than 20mb',
          }),
        ],
      }),
      SharpPipe,
    )
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    createPostDto.userId = <string>req.headers.userid;
    createPostDto.postId = req.body.postId;
    return await this.commandBus.execute(
      new CreatePostCommand(createPostDto, files),
    );
  }

  @Get('posts/get')
  async get(
    @PaginationParams() pagination: IPagination,
    @SortingParams(['createdAt', 'isPublished']) sorting?: ISorting,
    @FilteringParams(['isPublished', 'userId']) filtering?: IFiltering,
  ) {
    return await this.queryBus.execute(
      new GetPostsQuery(pagination, sorting, filtering),
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
    // todo! if error there need to delete local photos from files and posts
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

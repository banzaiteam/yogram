import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
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
} from 'apps/libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from 'apps/libs/common/pagination/decorators/sorting.decorator';
import {
  FilteringParams,
  IFiltering,
} from 'apps/libs/common/pagination/decorators/filtering.decorator';
import { GetPostsQuery } from '../use-cases/queries/get-posts.query';
import { SharpPipe } from 'apps/libs/common/pipes/sharp.pipe';
import { Post as PostResponse } from '../infrastracture/entity/post.entity';
import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { FileTypes } from 'apps/libs/Files/constants/file-type.enum';
import { DeletePostCommand } from '../use-cases/commands/delete-post.handler';
import EventEmmiter from 'events';
import { SsePostsEvents } from 'apps/posts/src/constants/sse-events.enum';
import { CancelUploadDto } from 'apps/libs/Posts/dto/input/cancel-upload.dto';
import { DeletePostEvent } from '../use-cases/events/delete-post.event';

@Controller()
export class PostsController {
  private readonly postEmmiter: EventEmmiter;

  constructor(
    private commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {
    this.postEmmiter = new EventEmmiter();
  }

  @Get('posts/sse-file')
  fileUploaded(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();

      this.postEmmiter.on(SsePostsEvents.FIleUploaded, (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });

      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('🚀 ~ PostsController ~ posts-sse ~ error:', error);
      res.write(`data: ${error}\n\n`);
    }
  }

  @Post('posts/cancel')
  async cancelUpload(@Body() cancelUploadDto: CancelUploadDto) {
    const { userId, postId } = cancelUploadDto;
    return await this.eventBus.publish(new DeletePostEvent(userId, postId));
  }

  @Post('posts/create')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          cb(
            null,
            await getUploadPath(
              FileTypes.Posts,
              'apps/posts/src/features/posts/uploads/posts',
              req,
            ),
          );
        },
        filename: (req, file, cb) => {
          cb(null, genFileName(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(JPG|jpg|jpeg|JPEG|png|PNG)$/)) {
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
  ): Promise<PostResponse> {
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
  ): Promise<PostPaginatedResponseDto> {
    return await this.queryBus.execute(
      new GetPostsQuery(pagination, sorting, filtering),
    );
  }

  @Patch('posts/update')
  async update(
    @Body()
    payload: UpdatePostCriteria & UpdatePostDto,
  ): Promise<void> {
    const criteria = { id: payload['criteria'] };
    const updatePostDto = payload['updatePostDto'];
    return await this.commandBus.execute(
      new UpdatePostCommand(criteria, updatePostDto, this.postEmmiter),
    );
  }

  @Delete('posts/delete/:userid/:postid')
  async delete(
    @Param('userid') userId: string,
    @Param('postid') postId: string,
  ) {
    return await this.commandBus.execute(new DeletePostCommand(userId, postId));
  }

  @EventSubscribe({ routingKey: FilesRoutingKeys.FilesUploadedPosts })
  async updateCreatedPost(rtKey: string, { payload }: IEvent): Promise<void> {
    let folderPath: string = <string>payload['folderPath'];
    folderPath = folderPath.substring(folderPath.lastIndexOf('/') + 1);
    const criteria = {
      id: folderPath,
      fileid: payload['fileId'],
    };
    const updatePostDto = { url: payload['url'], status: FileStatus.Ready };
    return await this.commandBus.execute(
      new UpdatePostCommand(criteria, updatePostDto, this.postEmmiter),
    );
  }
}

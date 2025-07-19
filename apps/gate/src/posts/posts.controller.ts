import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Request, Response } from 'express';
import { User } from '../auth/decorators/user.decorator';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { v4 } from 'uuid';
import {
  IPagination,
  PaginationParams,
} from '../../../libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from '../../../libs/common/pagination/decorators/sorting.decorator';
import {
  FilteringParams,
  IFiltering,
} from '../../../libs/common/pagination/decorators/filtering.decorator';
import { plainToInstance } from 'class-transformer';
import { PostPaginatedResponseDto } from '../../../../apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { GetSwagger } from './decorators/swagger/get-swagger.decorator';
import { ConfigService } from '@nestjs/config';
import { HttpPostsPath } from '../../../../apps/libs/Posts/constants/path.enum';
import { UpdatePostDto } from '../../../../apps/libs/Posts/dto/input/update-post.dto';
import { CreateSwagger } from './decorators/swagger/create-swagger.decorator';
import { DeleteSwagger } from './decorators/swagger/delete-swagger.decorator';
import { UpdateSwagger } from './decorators/swagger/update-swagger.decorator';
import { PublishSwagger } from './decorators/swagger/publish-swagger.decorator';
import { CancelUploadDto } from '../../../../apps/libs/Posts/dto/input/cancel-upload.dto';
import { SseCancelTokenSwagger } from './decorators/swagger/sse-cancel-token-swagger.decorator';
import { CancelPostSwagger } from './decorators/swagger/cancel-post-swagger.decorator';
import { SseFileSwagger } from './decorators/swagger/sse-file-swagger.decorator';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { LoggedUserDto } from '../../../../apps/libs/Users/dto/user/logged-user.dto';
import { CreateCommentDto } from '../../../../apps/libs/Posts/dto/input/create-comment.dto';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { UpdateCommentDto } from '../../../../apps/libs/Posts/dto/input/update-comment.dto';
import { AddCommentSwagger } from './decorators/swagger/add-comment-swagger.decorator';
import { UpdateCommentSwagger } from './decorators/swagger/update-comment-swagger.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService,
    private readonly gateService: GateService,
    private readonly httpService: HttpService,
  ) {}

  @Public()
  @SseFileSwagger()
  @Get('sse-file')
  async fileUploaded(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();

      const microserviceResponse = await axios.get(
        [this.configService.get('POSTS_SERVICE_URL'), 'posts/sse-file'].join(
          '/',
        ),
        {
          // generate uuid for posts because of multer call destination method on each uploaded file
          headers: { ...req.headers },
          responseType: 'stream',
        },
      );
      microserviceResponse.data.pipe(res);

      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('🚀 ~ PostsController ~ posts-sse ~ error:', error);
      res.write(`data: ${error}\n\n`);
    }
  }

  @Public()
  @SseCancelTokenSwagger()
  @Get('sse-cancel-token')
  async getCancelToken(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();

      const microserviceResponse = await axios.get(
        [
          this.configService.get('POSTS_SERVICE_URL'),
          'posts/sse-cancel-token',
        ].join('/'),
        {
          headers: { ...req.headers },
          responseType: 'stream',
        },
      );
      microserviceResponse.data.pipe(res);

      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('PostsController ~ sse-cancel-token ~ error:', error);
      res.write(`data: ${error}\n\n`);
    }
  }

  @CancelPostSwagger()
  @Post('cancel')
  async cancelUpload(@Body() cancelUploadDto: CancelUploadDto) {
    return await this.postsService.cancelUpload(cancelUploadDto);
  }

  @CreateSwagger()
  @Post()
  async create(
    @User() user: LoggedUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // if (!user.verified)
      //   throw new BadRequestException(
      //     'PostsController error: cant create post, user`s account not verified',
      //   );
      // todo! error 413, bodyparser limit 150 mb does not help when use gateService
      const postid = v4();
      const microserviceResponse = await axios.post(
        [
          this.configService.get('POSTS_SERVICE_URL'),
          HttpPostsPath.Create,
        ].join('/'),
        req,
        {
          // generate uuid for posts because of multer call destination method on each uploaded file
          headers: { ...req.headers, postid, userid: user.id },
          responseType: 'stream',
          maxBodyLength: 1500000000,
          maxContentLength: 1500000000,
        },
      );

      res.setHeader('content-type', 'application/json');
      microserviceResponse.data.pipe(res);
    } catch (err) {
      console.log('🚀 ~ PostsController ~ err:', err);
      // responseType: 'stream' error handle
      await new Promise((res) => {
        let streamString = '';
        // err.response.data.setEncoding('utf8');
        err.response.data
          .on('data', (utf8Chunk) => {
            streamString += utf8Chunk;
          })
          .on('end', async () => {
            err.response.stream = streamString;
          });
        setTimeout(() => {
          res(err);
        }, 300);
      }).then((data) => {
        throw new HttpException(data, data['status']);
      });
    }
  }

  @GetSwagger()
  @Get()
  async get(
    @PaginationParams() pagination: IPagination,
    @SortingParams(['createdAt', 'isPublished']) sorting?: ISorting,
    @FilteringParams(['id', 'isPublished', 'userId']) filtering?: IFiltering,
  ): Promise<PostPaginatedResponseDto> {
    const posts = await this.postsService.get(pagination, sorting, filtering);
    return plainToInstance(PostPaginatedResponseDto, posts);
  }

  @DeleteSwagger()
  @Delete(':id')
  async delete(@User('id') userId: string, @Param('id') id: string) {
    return await this.postsService.delete(userId, id);
  }

  @UpdateSwagger()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return await this.postsService.update(id, updatePostDto);
  }

  @PublishSwagger()
  @Patch('publish/:id')
  async publish(
    @Param('id') id: string,
    @Body() description?: Pick<UpdatePostDto, 'description'>,
  ) {
    const updatePostDto = {
      description: description['description'],
      isPublished: true,
    };
    return await this.postsService.update(id, updatePostDto);
  }

  @AddCommentSwagger()
  @Post('comments')
  async createComment(
    @User('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<void> {
    createCommentDto.userId = id;
    return await this.gateService.requestHttpServicePost(
      HttpServices.Posts,
      HttpPostsPath.AddComment,
      createCommentDto,
      {},
    );
  }

  @UpdateCommentSwagger()
  @Patch('comments/:id')
  async updateComment(
    @Body()
    updateCommentDto: UpdateCommentDto,
    @Param('id') id: string,
  ): Promise<void> {
    const upd = { id, updateCommentDto };
    return await this.gateService.requestHttpServicePatch(
      HttpServices.Posts,
      [HttpPostsPath.UpdateComment, id].join('/'),
      upd,
      {},
    );
  }
}

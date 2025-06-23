import { Controller, Get, HttpException, Post, Req, Res } from '@nestjs/common';
import { ApiConsumes, ApiHeaders, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { ResponsePostDto } from '../../../../apps/libs/Posts/dto/output/response-post.dto';
import { plainToInstance } from 'class-transformer';
import { PostPaginatedResponseDto } from '../../../../apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { GetSwagger } from './decorators/swagger/get-swagger.decorator';
import { ConfigService } from '@nestjs/config';
import { HttpPostsPath } from '../../../../apps/libs/Posts/constants/path.enum';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService,
    private readonly gateService: GateService,
    private readonly httpService: HttpService,
  ) {}

  @ApiHeaders([
    {
      name: 'Authorization',
      description: ' Authorization with bearer token',
    },
  ])
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'post was created',
    type: ResponsePostDto,
  })
  @Post()
  async create(
    @User('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // todo! error 413, bodyparser limit 150 mb does not help when use gateService
      const microserviceResponse = await axios.post(
        [
          this.configService.get('POSTS_SERVICE_URL'),
          HttpPostsPath.Create,
        ].join('/'),
        req,
        {
          // generate uuid for posts because of multer call destination method on each uploaded file
          headers: { ...req.headers, postid: v4(), userid: id },
          responseType: 'stream',
        },
      );

      res.setHeader('content-type', 'application/json');
      microserviceResponse.data.pipe(res);
    } catch (err) {
      // responseType: 'stream' error handle
      await new Promise((res) => {
        let streamString = '';
        err.response.data.setEncoding('utf8');
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
    @FilteringParams(['isPublished', 'userId']) filtering?: IFiltering,
  ): Promise<PostPaginatedResponseDto> {
    const posts = await this.postsService.get(pagination, sorting, filtering);
    return plainToInstance(PostPaginatedResponseDto, posts);
  }
}

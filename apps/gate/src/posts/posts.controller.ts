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

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
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
      // todo! error 413, bodyparser limit 150 mb does not help
      // const microserviceResponse =
      //   await this.gateService.requestHttpServicePost(
      //     HttpServices.Posts,
      //     HttpPostsPath.Create,
      //     req,
      //     {
      //       headers: { ...req.headers, postid: v4(), userid: id },
      //       // responseType: 'stream',
      //     },
      //   );
      const microserviceResponse = await axios.post(
        'http://localhost:3004/api/v1/posts/create',
        req,
        {
          // generate uuid for posts because of multer call destination method on each uploaded file
          headers: { ...req.headers, postid: v4(), userid: id },
          responseType: 'stream',
        },
      );
      res.setHeader('content-type', 'application/json');
      microserviceResponse.data.pipe(res);
    } catch (error) {
      throw new HttpException(error, error.response.status);
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

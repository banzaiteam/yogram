import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
} from '../../../../apps/gate/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from '../../../../apps/gate/common/pagination/decorators/sorting.decorator';
import {
  FilteringParams,
  IFiltering,
} from '../../../../apps/gate/common/pagination/decorators/filtering.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly gateService: GateService,
    private readonly httpService: HttpService,
  ) {}

  @ApiResponse({ status: 201, description: 'post was created' })
  @Post()
  @HttpCode(201)
  async create(
    @User('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
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
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  @Get(':id')
  get(
    @Param('id') id: string,
    @PaginationParams() pagination: IPagination,
    @SortingParams(['createdAt', 'isPublished']) sorting?: ISorting,
    @FilteringParams(['isPublished', 'userId']) filtering?: IFiltering,
  ) {
    return this.postsService.get(id, pagination, sorting, filtering);
  }
}

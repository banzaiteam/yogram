import {
  Controller,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Request, Response } from 'express';
import { User } from '../auth/decorators/user.decorator';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { v4 } from 'uuid';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly gateService: GateService,
    private readonly httpService: HttpService,
  ) {}

  @ApiExcludeEndpoint()
  @ApiResponse({ status: 201, description: 'post was created' })
  @Post()
  @HttpCode(201)
  async create(
    @User('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
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
}

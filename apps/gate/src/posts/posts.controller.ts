import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  Post,
  RawBody,
  RawBodyRequest,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { PostsService } from './posts.service';
import { Request, Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorators/user.decorator';
import { getUploadPath } from './helper';
import { diskStorage } from 'multer';
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
    // @Body() createPostDto: Omit<CreatePostDto, 'userId'>,
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

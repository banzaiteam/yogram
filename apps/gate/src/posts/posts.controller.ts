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
import { genFileName, getUploadPath } from './helper';
import { diskStorage } from 'multer';
import { GateService } from 'apps/libs/gateService';
import { HttpServices } from 'apps/gate/common/constants/http-services.enum';
import { HttpPostsPath } from 'apps/libs/Posts/constants/path.enum';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

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
    // todo create uploadFilesCommand, call postsService.create from handler then return files paths and upload to aws in handler
    try {
      const microserviceResponse = await axios.post(
        'http://localhost:3004/api/v1/posts/create',
        req,
        { headers: req.headers, responseType: 'stream' },
      );
      microserviceResponse.data.pipe(res);
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.response.data, error.response.status);
    }

    // return await this.postsService.create(createPostDto, files, id);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '../auth/decorators/user.decorator';
import { genFileName, getUploadPath } from './helper';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiResponse({ status: 201, description: 'post was created' })
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          cb(null, await getUploadPath(req['user'].id));
        },
        filename: (req, file, cb) => {
          cb(null, genFileName(file.originalname));
        },
      }),
    }),
  )
  @HttpCode(201)
  async create(
    @User('id') id: string,
    @Body() createPostDto: Omit<CreatePostDto, 'userId'>,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ): Promise<void> {
    return await this.postsService.create(createPostDto, files, id);
  }
}

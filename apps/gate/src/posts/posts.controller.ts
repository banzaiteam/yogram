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

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiResponse({ status: 201, description: 'post was created' })
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(201)
  async create(
    @User('id') id: string,
    @Body() createPostDto: Omit<CreatePostDto, 'userId'>,
    @UploadedFiles()
    files: Express.Multer.File[],
    @Req() req: Request,
  ): Promise<void> {
    // console.log('🚀 ~ PostsController ~ files:', files);
    return await this.postsService.create(createPostDto, files, id);
  }
}

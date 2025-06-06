import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { PostsService } from './posts.service';
import { Request } from 'express';

@ApiTags('Posts')
@Controller('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiResponse({ status: 201, description: 'post was created' })
  @Post()
  @HttpCode(201)
  async create(
    @Body() post: Omit<CreatePostDto, 'userId'>,
    @Req() req: Request,
  ): Promise<void> {
    console.log((req as any).user?.id, ' userId');
    return await this.postsService.create({
      description: post.description,
      userId: (req as any).user.id,
    });
  }
}

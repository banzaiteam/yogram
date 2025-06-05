import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { PostsService } from './posts.service';
import { Response, Request } from 'express';

@ApiTags('Posts')
@Controller('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiResponse({ status: 201, description: 'post was created' })
  @Post()
  async create(
    @Body() post: Omit<CreatePostDto, 'userId'>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    console.log((req as any).user?.id);
    await this.postsService.create({
      description: post.description,
      userId: (req as any).user.id,
    });
    res.status(201);
  }
}

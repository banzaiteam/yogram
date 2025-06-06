import { Injectable } from '@nestjs/common';
import { GateService } from '../../../libs/gateService';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly gateService: GateService) { }
  async create(createPostDto: CreatePostDto): Promise<void> {
    return await this.gateService.requestHttpServicePost(
      'POSTS',
      HttpPostsPath.Create,
      createPostDto,
      {},
    );
  }
}

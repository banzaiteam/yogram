import { Injectable } from '@nestjs/common';
import { GateService } from '../../../libs/gateService';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';

@Injectable()
export class PostsService {
  constructor(private readonly gateService: GateService) {}
  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    id: string,
  ): Promise<void> {
    console.log('🚀 ~ PostsService ~ files:', files);
    createPostDto.userId = id;
    return await this.gateService.requestHttpServicePost(
      HttpServices.Posts,
      HttpPostsPath.Create,
      { createPostDto, files },
      {},
    );
  }
}

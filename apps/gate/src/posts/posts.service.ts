import { Injectable } from '@nestjs/common';
import { GateService } from '../../../libs/gateService';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { ChunksFileUploader } from 'apps/libs/common/upload/chunks-file-uploader.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly gateService: GateService,
    private readonly chunksFileUploader: ChunksFileUploader,
  ) {}
  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    id: string,
  ): Promise<void> {
    console.log('🚀 ~ PostsService ~ files:', files);

    createPostDto.userId = id;
    await this.chunksFileUploader.proccessChunksUpload(files, id);
    // return await this.gateService.requestHttpServicePost(
    //   HttpServices.Posts,
    //   HttpPostsPath.Create,
    //   { createPostDto, files },
    //   {},
    // );
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpPostsPath } from '../../../libs/Posts/constants/path.enum';
import { CreatePostDto } from '../../../libs/Posts/dto/input/create-post.dto';
import { ChunksFileUploader } from '../../../libs/common/chunks-upload/chunks-file-uploader.service';
import fs from 'node:fs/promises';
import { HttpServices } from 'apps/gate/common/constants/http-services.enum';

@Injectable()
export class PostsService {
  constructor(private readonly chunksFileUploader: ChunksFileUploader) {}

  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    id: string,
  ): Promise<void> {
    createPostDto.userId = id;
    try {
      // await this.chunksFileUploader.proccessChunksUpload(
      //   files,
      //   id,
      //   HttpPostsPath.Create,
      //   HttpServices.Files
      // );
      for await (const file of files) {
        await fs.unlink(file.path);
      }
    } catch (error) {
      await fs.rm(files[0].destination, { recursive: true });
      throw new InternalServerErrorException(
        'FileUploader: error  during uploading files',
      );
    }
  }
}

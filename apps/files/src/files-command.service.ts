import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IUploader,
  UploadFilesResponse,
} from './features/files/providers/interface/uploader.interface';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';
import fs from 'node:fs/promises';
import { DeletePostFilesDto } from 'apps/libs/Files/dto/delete-post-files.dto';

@Injectable()
export class FilesCommandService {
  constructor(private readonly uploaderService: IUploader) {}

  async createBucket(name: string): Promise<String> {
    return await this.uploaderService.createBucket(name);
  }

  async uploadFiles(
    files: any,
    bucket: AwsBuckets,
  ): Promise<UploadFilesResponse> {
    console.log('🚀 ~ FilesCommandService ~ files:', files);
    try {
      return await this.uploaderService.uploadFiles(files, bucket);
    } catch (err) {
      throw new InternalServerErrorException(
        'FilesCommandService error: files was not uploaded',
      );
    }
  }
  // todo! if files array passed delete only this files , else all folder
  async deleteUploadedFolderOrFiles(deleteFilesDto: DeletePostFilesDto) {
    const path = [
      deleteFilesDto.filesServiceUploadFolderWithoutBasePath,
      deleteFilesDto.postId,
    ].join('/');
    console.log('🚀 ~ FilesCommandService ~ deleteUploadedFiles ~ path:', path);
    return await this.uploaderService.deleteFiles(path);
  }

  async deleteLocalFolderWithFiles(path: string) {
    try {
      await fs.rm(path, { recursive: true });
    } catch (err) {
      throw new InternalServerErrorException(
        `FilesCommandService error: file ${path} uploaded to provider was not deleted. Next files will not be uploaded`,
      );
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IUploader,
  UploadFilesResponse,
} from './features/files/providers/interface/uploader.interface';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';
import fs from 'node:fs/promises';

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
    try {
      return await this.uploaderService.uploadFiles(files, bucket);
    } catch (err) {
      throw new InternalServerErrorException(
        'FilesCommandService error: files was not uploaded',
      );
    }
  }

  async deleteLocalFileFromPath(path: string) {
    try {
      await fs.rm(path, { recursive: true });
    } catch (err) {
      throw new InternalServerErrorException(
        `FilesCommandService error: file ${path} uploaded to provider was not deleted. Next files will not be uploaded`,
      );
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  IUploader,
  UploadFilesResponse,
} from './features/files/providers/interface/uploader.interface';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';

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
    } catch (error) {
      throw new InternalServerErrorException(
        'FilesCommandService error: files was not uploaded',
      );
    }
  }
}

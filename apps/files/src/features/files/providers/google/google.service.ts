import { Injectable } from '@nestjs/common';
import {
  IUploader,
  UploadFilesResponse,
} from '../interface/uploader.interface';
import { ChunkedFileDto } from 'apps/libs/common/chunks-upload/dto/chunked-file.dto';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';

@Injectable()
export class GoogleService implements IUploader {
  constructor() {}
  isBucketExists(name: string, accountId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  createBucket(name: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async uploadFiles(
    files: ChunkedFileDto,
    bucket: AwsBuckets,
  ): Promise<UploadFilesResponse> {
    console.log('GoogleService');
    return;
  }
}

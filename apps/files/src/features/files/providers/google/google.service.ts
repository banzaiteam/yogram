import { Injectable } from '@nestjs/common';
import {
  IUploader,
  UploadFilesResponse,
} from '../interface/uploader.interface';

@Injectable()
export class GoogleService implements IUploader {
  constructor() {}
  isBucketExists(name: string, accountId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  createBucket(name: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async uploadFiles(): Promise<UploadFilesResponse> {
    console.log('GoogleService');
    return;
  }
}

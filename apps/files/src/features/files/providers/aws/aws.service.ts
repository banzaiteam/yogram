import { Injectable } from '@nestjs/common';
import {
  IUploader,
  UploadFilesResponse,
} from '../interface/uploader.interface';

@Injectable()
export class AwsService implements IUploader {
  constructor() {}

  async uploadFiles(): Promise<UploadFilesResponse> {
    console.log('AwsService');
    return;
  }
}

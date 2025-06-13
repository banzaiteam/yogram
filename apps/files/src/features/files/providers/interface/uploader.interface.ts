import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export interface UploadFilesResponse {
  userId: UUID;
  folder: string;
  urls: string[];
}

export abstract class IUploader {
  abstract uploadFiles(path: string, files: any): Promise<UploadFilesResponse>;
  abstract createBucket(name: string): Promise<string>;
  abstract isBucketExists(name: string, accountId: string): Promise<boolean>;
}

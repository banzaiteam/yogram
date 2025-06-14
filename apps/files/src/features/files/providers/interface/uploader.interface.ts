import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export interface UploadFilesResponse {
  userId: UUID;
  folder: string;
  urls: string[];
}

export abstract class IUploader {
  abstract uploadFiles(path: string, files: any): Promise<UploadFilesResponse>;
}

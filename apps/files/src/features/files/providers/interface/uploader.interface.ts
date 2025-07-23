import { ChunkedFileDto } from 'apps/libs/common/chunks-upload/dto/chunked-file.dto';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';

export interface UploadFilesResponse {
  folderPath: string;
  url: string;
  fileId: string;
  fileName: string;
}

export abstract class IUploader {
  abstract uploadFiles(
    files: ChunkedFileDto,
    bucketName: string,
  ): Promise<UploadFilesResponse>;
  abstract createBucket(bucketName: string): Promise<string>;
  abstract isBucketExists(
    bucketName: string,
    accountId: string,
  ): Promise<boolean>;
  abstract deleteFolder(bucketName: string, path: string): Promise<boolean>;
  abstract listObjects(bucketName: string, path: string): Promise<any>;
}

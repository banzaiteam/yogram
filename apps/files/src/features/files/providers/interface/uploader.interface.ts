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
    bucketName: AwsBuckets,
  ): Promise<UploadFilesResponse>;
  abstract createBucket(bucketName: string): Promise<string>;
  abstract isBucketExists(
    bucketName: string,
    accountId: string,
  ): Promise<boolean>;
  abstract deleteFolder(bucketName: AwsBuckets, path: string): Promise<boolean>;
}

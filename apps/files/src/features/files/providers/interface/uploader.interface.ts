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
    bucket: AwsBuckets,
  ): Promise<UploadFilesResponse>;
  abstract createBucket(name: string): Promise<string>;
  abstract isBucketExists(name: string, accountId: string): Promise<boolean>;
  abstract deleteFiles(path: string): Promise<void>;
}

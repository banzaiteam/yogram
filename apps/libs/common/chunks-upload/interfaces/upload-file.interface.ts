import { FileTypes } from 'apps/libs/Files/constants/file-type.enum';

export interface UploadFile
  extends Omit<
    Express.Multer.File,
    'buffer' | 'filename' | 'stream' | 'encoding'
  > {
  fileId: string;
  filesUploadBaseDir: string;
  fileType: FileTypes;
  bucketName: string;
}

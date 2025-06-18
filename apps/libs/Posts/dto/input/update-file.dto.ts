import { FileStatus } from 'apps/posts/src/features/posts/constants/file.constant';
import { IsEnum, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  url: string;
  @IsEnum({ enum: FileStatus })
  status: FileStatus;
}

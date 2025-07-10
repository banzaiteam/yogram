import {
  IsDate,
  IsEnum,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Post } from '../features/posts/infrastracture/entity/post.entity';
import { Type } from 'class-transformer';
import { FileStatus } from '../features/posts/constants/file.constant';

export class CreateFileDto {
  @IsUUID()
  id: string;
  @IsString()
  fileName: string;
  @IsString()
  url: string;
  @IsString()
  metatype: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  deletedAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsEnum({ enum: FileStatus, default: FileStatus.Pending })
  status: FileStatus;
  @Type(() => Post)
  @ValidateNested()
  post: Post;
  @IsUUID()
  postid: string;
}

import { IsString, ValidateNested } from 'class-validator';
import { Post } from '../features/posts/infrastracture/entity/post.entity';
import { Type } from 'class-transformer';

export class CreateFileDto {
  @IsString()
  fileName: string;
  @IsString()
  url: string;
  @IsString()
  metatype: string;
  @Type(() => Post)
  @ValidateNested()
  post: Post;
}

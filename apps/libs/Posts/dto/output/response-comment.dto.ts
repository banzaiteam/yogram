import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseCommentDto {
  @Expose()
  id: string;
  @Expose()
  userId: string;
  @Expose()
  text: string;
  @Expose()
  likes: number;
  @Expose()
  parentId?: string;
}

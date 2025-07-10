import { IsOptional, IsUUID } from 'class-validator';

export class FindCommentCriteria {
  @IsUUID()
  @IsOptional()
  id?: string;
  @IsUUID()
  @IsOptional()
  postId?: string;
  @IsUUID()
  @IsOptional()
  userId?: string;
  @IsUUID()
  @IsOptional()
  parentId?: string;
}

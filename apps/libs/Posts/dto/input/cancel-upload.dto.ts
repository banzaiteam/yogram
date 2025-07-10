import { IsUUID } from 'class-validator';

export class CancelUploadDto {
  @IsUUID()
  userId: string;
  @IsUUID()
  postId: string;
}

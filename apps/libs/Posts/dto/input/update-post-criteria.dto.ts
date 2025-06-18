import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

ApiProperty({
  description: 'find post which should be updated by postId or fileId',
});
export class UpdatePostCriteria {
  @IsOptional()
  @IsUUID()
  id?: string;
  @IsOptional()
  @IsUUID()
  fileid?: string;
}

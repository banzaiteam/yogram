import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CriteriaDto } from './criteria.dto';
import { Type } from 'class-transformer';

ApiProperty({
  description: 'find post by postId or fileId which should be updated ',
});
export class UpdatePostCriteria {
  @IsOptional()
  @IsUUID()
  id?: string;
  @IsOptional()
  @IsUUID()
  fileid?: string;
  @IsUUID()
  @IsOptional()
  userId?: string;
}

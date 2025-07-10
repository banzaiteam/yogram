import { IsOptional, IsUUID } from 'class-validator';

export class CriteriaDto {
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

import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ChunkMetadataDto } from './chunk-metadata.dto';
import { Type } from 'class-transformer';

export class ChunkedFileDto {
  @IsString()
  fieldname: string;
  @IsString()
  originalname: string;
  @IsString()
  mimetype: string;
  @IsNumber()
  size: number;
  @IsString()
  chunk: string;
  @ValidateNested()
  @Type(() => ChunkMetadataDto)
  metadata: ChunkMetadataDto;
  @IsUUID()
  userId: string;
}

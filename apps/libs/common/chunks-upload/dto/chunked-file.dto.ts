import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ChunkMetadataDto } from './chunk-metadata.dto';
import { Type } from 'class-transformer';
import { FileTypes } from 'apps/libs/Files/constants/file-type.enum';

export class ChunkedFileDto {
  @IsString()
  fileType: FileTypes;
  @IsString()
  filesUploadBaseDir: string;
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
  @IsString()
  filesServiceUploadFolderWithoutBasePath: string;
  @IsString()
  pathToFile: string;
  @IsUUID()
  fileId: string;
}

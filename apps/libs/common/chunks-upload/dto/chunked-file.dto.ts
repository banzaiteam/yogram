import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ChunkMetadataDto } from './chunk-metadata.dto';
import { Type } from 'class-transformer';
import { FileTypes } from '../../../../../apps/libs/Files/constants/file-type.enum';
import { FilesRoutingKeys } from '../../../../../apps/files/src/features/files/message-brokers/rabbit/files-routing-keys.constant';

export class ChunkedFileDto {
  @IsString()
  routingKey: FilesRoutingKeys;
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
  fileId?: string;
}

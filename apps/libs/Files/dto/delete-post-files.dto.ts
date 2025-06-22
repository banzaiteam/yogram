import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class DeletePostFilesDto {
  @IsUUID()
  postId: string;
  @ApiProperty({ description: 'path to folder with files in files service' })
  @IsString()
  filesServiceUploadFolderWithoutBasePath: string;
  @ApiProperty({
    description:
      'leave empty if need delete folder with all files or pass array of files names',
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  files?: string[];
}

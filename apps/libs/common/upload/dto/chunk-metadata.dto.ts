import { IsNumber } from 'class-validator';

export class ChunkMetadataDto {
  @IsNumber()
  totalChunks: number;
  @IsNumber()
  currentChunk: number;
}

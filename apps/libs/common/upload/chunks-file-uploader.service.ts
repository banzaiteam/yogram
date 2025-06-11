import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChunkedFileDto } from './dto/chunked-file.dto';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { GateService } from 'apps/libs/gateService';
import { HttpPostsPath } from 'apps/libs/Posts/constants/path.enum';
import { HttpServices } from 'apps/gate/common/constants/http-services.enum';

@Injectable()
export class ChunksFileUploader {
  constructor(private readonly gateService: GateService) {}

  async proccessChunksUpload(files: Express.Multer.File[], userId: string) {
    for await (const file of files) {
      const chunkSize = 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);
      let startByte = 0;
      for (let i = 1; i <= totalChunks; i++) {
        const endByte = Math.min(startByte + chunkSize, file.size);
        let chunk = file.buffer.subarray(startByte, endByte);
        await this.uploadChunk(
          JSON.stringify(chunk),
          totalChunks,
          i,
          file,
          userId,
        );
        startByte = endByte;
      }
    }
  }

  private async uploadChunk(
    chunk: string,
    totalChunks: number,
    currentChunk: number,
    file: Express.Multer.File,
    userId: string,
  ) {
    const chunkedFileDto: ChunkedFileDto = {
      chunk,
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
      userId,
      metadata: { currentChunk, totalChunks },
    };
    const response = await this.gateService.requestHttpServicePost(
      HttpServices.Posts,
      HttpPostsPath.Create,
      chunkedFileDto,
      {},
    );
    console.log('🚀 ~ FileUploader ~ response:', response);
  }

  async proccessComposeFile(chunkedFileDto: ChunkedFileDto) {
    const CHUNKS_DIR = 'apps/posts/src/features/posts/chunks';
    const UPLOAD_DIR = 'apps/posts/src/features/posts/uploads';
    const chunkPath = `${CHUNKS_DIR}/${chunkedFileDto.userId}`;
    const uploadsPath = `${UPLOAD_DIR}/${chunkedFileDto.userId}`;
    await this.createFolderIfNotExists(chunkPath);

    try {
      // convert chunk back to buffer
      const bufferChunk = Buffer.from(JSON.parse(chunkedFileDto.chunk));
      const blob = new Blob([bufferChunk]);
      // stream from buffer
      const stream = blob.stream();
      const writableChunk = await fs.open(
        [
          chunkPath,
          [
            chunkedFileDto.originalname,
            chunkedFileDto.metadata.currentChunk,
          ].join('.'),
        ].join('/'),
        'w',
      );

      const writable = writableChunk.createWriteStream();
      await pipeline(stream, writable);
      if (
        +chunkedFileDto.metadata.currentChunk ===
        +chunkedFileDto.metadata.totalChunks
      ) {
        // All chunks have been uploaded, assemble them into a single file
        await this.assembleChunks(
          chunkedFileDto.originalname,
          +chunkedFileDto.metadata.totalChunks,
          CHUNKS_DIR,
          uploadsPath,
          chunkedFileDto.userId,
        );
      }
    } catch (err) {
      console.error('Error moving chunk file:', err);
      throw new InternalServerErrorException('Error uploading chunk');
    }
  }

  private async assembleChunks(
    filename: string,
    totalChunks: number,
    chunksDir: string,
    uploadsPath: string,
    userId: string,
  ) {
    try {
      await this.createFolderIfNotExists(uploadsPath);
      const file = await fs.open(`${uploadsPath}/${filename}`, 'w');
      const writer = file.createWriteStream();
      for (let i = 1; i <= totalChunks; i++) {
        const chunkPath = `${chunksDir}/${userId}/${filename}.${i}`;
        const readableFile = await fs.open(chunkPath, 'r');
        await pipeline(readableFile.createReadStream(), writer);
        await fs.unlink(chunkPath);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'FileUploader: error  during deleting chunk file',
      );
    }
  }

  async createFolderIfNotExists(folder: string) {
    await fs
      .access(folder)
      .then(() => undefined)
      .catch(async () => await fs.mkdir(folder, { recursive: true }));
  }
}

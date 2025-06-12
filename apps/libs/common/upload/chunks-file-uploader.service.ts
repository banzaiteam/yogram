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

  async proccessChunksUpload(
    files: Express.Multer.File[],
    userId: string,
    endpoint: HttpPostsPath,
  ) {
    // todo devide files on chunks
    for await (const file of files) {
      const chunkSize = 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);
      let startByte = 0;
      for (let i = 1; i <= totalChunks; i++) {
        const endByte = Math.min(startByte + chunkSize, file.size);
        const openFile = await fs.open(file.path, 'r');
        const readable = openFile.createReadStream();
        const chunks = [];
        for await (const chunk of readable) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        let chunk = buffer.subarray(startByte, endByte);
        await this.uploadChunk(
          endpoint,
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
    endpoint: HttpPostsPath,
    chunk: string,
    totalChunks: number,
    currentChunk: number,
    file: Express.Multer.File,
    userId: string,
  ) {
    // todo upload chunk to posts microservice
    const chunkedFileDto: ChunkedFileDto = {
      chunk,
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname,
      pathToFile: file.path,
      size: file.size,
      userId,
      metadata: { currentChunk, totalChunks },
    };

    const response = await this.gateService.requestHttpServicePost(
      HttpServices.Posts,
      endpoint,
      chunkedFileDto,
      {},
    );
  }

  async proccessComposeFile(chunkedFileDto: ChunkedFileDto): Promise<void> {
    const CHUNKS_DIR = 'apps/posts/src/features/posts/chunks';
    const UPLOAD_DIR = 'apps/posts/src/features/posts/uploads';
    const chunksPath = `${CHUNKS_DIR}/${chunkedFileDto.userId}`;
    const uploadsPath = `${UPLOAD_DIR}/${chunkedFileDto.userId}`;
    await this.createFolderIfNotExists(chunksPath);

    try {
      // convert chunk back to buffer
      const bufferChunk = Buffer.from(JSON.parse(chunkedFileDto.chunk));
      const blob = new Blob([bufferChunk]);
      // stream from buffer
      const stream = blob.stream();
      const writableChunk = await fs.open(
        [
          chunksPath,
          [
            chunkedFileDto.originalname,
            chunkedFileDto.metadata.currentChunk,
          ].join('.'),
        ].join('/'),
        'w',
      );
      // todo write chunk to file
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
          chunksPath,
          uploadsPath,
          chunkedFileDto.userId,
        );
      }
    } catch (err) {
      console.error('Error moving chunk file:', err);
      throw new InternalServerErrorException(
        'FileUploader: proccessComposeFile error during uploading files',
      );
    }
  }

  private async assembleChunks(
    filename: string,
    totalChunks: number,
    chunksDirPath: string,
    uploadsPath: string,
    userId: string,
  ): Promise<void> {
    try {
      // todo write chunk files to file
      await this.createFolderIfNotExists(uploadsPath);
      const file = await fs.open(`${uploadsPath}/${filename}`, 'w');
      const writer = file.createWriteStream();
      writer.on('unpipe', () => {
        console.log(`finish write`);
        writer.close();
        file.close();
      });
      // write all chunks to file
      for (let i = 1; i <= totalChunks; i++) {
        const chunkPath = `${chunksDirPath}/${filename}.${i}`;
        const readableFile = await fs.open(chunkPath, 'r');
        const reader = readableFile.createReadStream();
        await pipeline(reader, writer, { end: false });
        reader.close();
        readableFile.close();
        await fs.unlink(chunkPath);
      }
      writer.end();
    } catch (error) {
      await fs.rm(chunksDirPath, { recursive: true });
      await fs.rm(uploadsPath, { recursive: true });
      console.log('🚀 ~ ChunksFileUploader ~ error:', error);
      throw new InternalServerErrorException(
        'FileUploader: assembleChunks error  during uploading files',
      );
    }
  }

  async createFolderIfNotExists(folder: string): Promise<void> {
    await fs
      .access(folder)
      .then(() => undefined)
      .catch(async () => await fs.mkdir(folder, { recursive: true }));
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChunkedFileDto } from './dto/chunked-file.dto';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpPostsPath } from '../../../../apps/libs/Posts/constants/path.enum';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChunksFileUploader {
  constructor(private readonly httpService: HttpService) {}

  async proccessChunksUpload(
    files: Express.Multer.File[],
    folderPath: string,
    path: string, // todo rename
    host: string,
  ): Promise<void> {
    // todo devide files on chunks
    for await (const file of files) {
      const chunkSize = 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);
      let startByte = 0;
      const openFile = await fs.open(file.path, 'r');
      const readable = openFile.createReadStream();
      const chunks = [];
      for await (const chunk of readable) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      readable.removeAllListeners();
      await openFile.close();
      readable.close();
      for (let i = 1; i <= totalChunks; i++) {
        const endByte = Math.min(startByte + chunkSize, file.size);
        let chunk = buffer.subarray(startByte, endByte);
        //test
        await this.uploadChunk(
          path,
          JSON.stringify(chunk),
          totalChunks,
          i,
          file,
          folderPath,
          host,
        );
        startByte = endByte;
      }
    }
  }

  private async uploadChunk(
    path: string,
    chunk: string,
    totalChunks: number,
    currentChunk: number,
    file: Express.Multer.File,
    folderPath: string,
    host: string,
  ): Promise<void> {
    // todo upload chunk to posts microservice
    const chunkedFileDto: ChunkedFileDto = {
      chunk,
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname,
      pathToFile: file.path,
      size: file.size,
      folderPath,
      metadata: { currentChunk, totalChunks },
    };

    await firstValueFrom(
      this.httpService.post([host, path].join('/'), chunkedFileDto),
    );
  }

  async proccessComposeFile(chunkedFileDto: ChunkedFileDto): Promise<void> {
    const CHUNKS_DIR = 'apps/files/src/features/files/chunks';
    const UPLOAD_DIR = 'apps/files/src/features/files/uploads';
    const chunksPath = `${CHUNKS_DIR}/${chunkedFileDto.folderPath}`;
    const uploadsPath = `${UPLOAD_DIR}/${chunkedFileDto.folderPath}`;
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
      writable.on('finish', async () => {
        console.log('proccessComposeFile finish!!!');
        await writableChunk.close();
        writable.end();
      });

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
  ): Promise<void> {
    console.log('🚀 ~ ChunksFileUploader ~ chunksDirPath:', chunksDirPath);
    try {
      // todo write chunk files to file
      await this.createFolderIfNotExists(uploadsPath);
      const file = await fs.open(`${uploadsPath}/${filename}`, 'w');
      const writer = file.createWriteStream();
      writer.on('finish', async () => {
        console.log(`finish write`);
        writer.removeAllListeners();
        writer.close();
        await file.close();
      });
      // write all chunks to file
      for (let i = 1; i <= totalChunks; i++) {
        const chunkPath = `${chunksDirPath}/${filename}.${i}`;
        const readableFile = await fs.open(chunkPath, 'r');
        const reader = readableFile.createReadStream();
        await pipeline(reader, writer, { end: false });
        reader.removeAllListeners();
        reader.close();
        await readableFile.close();
        await fs.unlink(chunkPath);
      }
      writer.end();
      await fs.rm(chunksDirPath, { recursive: true });
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

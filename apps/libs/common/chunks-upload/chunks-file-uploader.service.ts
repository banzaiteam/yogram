import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChunkedFileDto } from './dto/chunked-file.dto';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UploadFile } from './interfaces/upload-file.interface';
import { FileTypes } from 'apps/libs/Files/constants/file-type.enum';
import { FilesRoutingKeys } from 'apps/files/src/features/files/message-brokers/rabbit/files-routing-keys.constant';

@Injectable()
export class ChunksFileUploader {
  constructor(private readonly httpService: HttpService) {}

  async proccessChunksUpload(
    routingKey: FilesRoutingKeys,
    files: UploadFile[],
    filesServiceUploadFolderWithoutBasePath: string,
    uploadServiceUrl: string,
  ): Promise<void> {
    console.log(
      '🚀 ~ ChunksFileUploader ~ uploadServiceUrl:',
      uploadServiceUrl,
    );
    // todo devide files on chunks
    const filesCount = files.length;
    let currentFile = 0;
    for await (const file of files) {
      ++currentFile;
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
          routingKey,
          JSON.stringify(chunk),
          totalChunks,
          i,
          filesCount,
          currentFile,
          file,
          filesServiceUploadFolderWithoutBasePath,
          uploadServiceUrl,
        );
        startByte = endByte;
      }
    }
  }

  private async uploadChunk(
    routingKey: FilesRoutingKeys,
    chunk: string,
    totalChunks: number,
    currentChunk: number,
    filesCount: number,
    currentFile: number,
    file: UploadFile,
    filesServiceUploadFolderWithoutBasePath: string,
    uploadServiceUrl: string,
  ): Promise<void> {
    // todo upload chunk to posts microservice
    const pathToFile = [
      filesServiceUploadFolderWithoutBasePath,
      file.originalname,
    ].join('/');
    const chunkedFileDto: ChunkedFileDto = {
      bucketName: file.bucketName,
      routingKey,
      fileType: file.fileType,
      filesUploadBaseDir: file.filesUploadBaseDir,
      chunk,
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname,
      pathToFile,
      size: file.size,
      fileId: file.fileId,
      filesServiceUploadFolderWithoutBasePath,

      metadata: { currentChunk, totalChunks, filesCount, currentFile },
    };
    console.log('🚀 ~ ChunksFileUploader ~ chunkedFileDto:', chunkedFileDto);

    await firstValueFrom(
      this.httpService.post(uploadServiceUrl, chunkedFileDto),
    );
  }
  // todo! need to pass CHUNKS_DIR and UPLOAD_DIR
  async proccessComposeFile(chunkedFileDto: ChunkedFileDto): Promise<void> {
    console.log(
      '🚀 ~ ChunksFileUploader ~ proccessComposeFile ~ chunkedFileDto:',
      chunkedFileDto,
    );
    const CHUNKS_DIR = 'apps/files/src/features/files/chunks/avatars';
    const UPLOAD_DIR = 'apps/files/src/features/files/uploads';
    const chunksPath = `${CHUNKS_DIR}/${chunkedFileDto.filesServiceUploadFolderWithoutBasePath}`;
    const uploadsPath = `${chunkedFileDto.filesUploadBaseDir}/${chunkedFileDto.pathToFile}`;
    console.log(
      '🚀 ~ ChunksFileUploader ~ proccessComposeFile ~ chunksPath:',
      chunksPath,
    );

    await this.createFolderIfNotExists(chunksPath);
    await this.createFolderIfNotExists(
      [
        chunkedFileDto.filesUploadBaseDir,
        chunkedFileDto.filesServiceUploadFolderWithoutBasePath,
      ].join('/'),
    );

    try {
      // convert chunk back to buffer
      const bufferChunk = Buffer.from(JSON.parse(chunkedFileDto.chunk));
      const blob = new Blob([bufferChunk]);
      // stream from buffer
      const stream = blob.stream();
      console.log(
        'upload file path ====',
        [
          chunksPath,
          [
            chunkedFileDto.originalname,
            chunkedFileDto.metadata.currentChunk,
          ].join('.'),
        ].join('/'),
      );

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
        console.log('writable chunk');
        await writableChunk.close();
        writable.end();
      });

      if (
        +chunkedFileDto.metadata.currentChunk ===
        +chunkedFileDto.metadata.totalChunks
      ) {
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
    try {
      // todo write chunk files to file
      // await this.createFolderIfNotExists(uploadsPath);
      const file = await fs.open(`${uploadsPath}`, 'w');
      const writer = file.createWriteStream();

      writer.on('finish', async () => {
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
      // todo check error
      // throw new Error();
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

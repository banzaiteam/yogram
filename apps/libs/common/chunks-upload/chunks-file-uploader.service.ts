import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChunkedFileDto } from './dto/chunked-file.dto';
import fs from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UploadFile } from './interfaces/upload-file.interface';
import { FilesRoutingKeys } from 'apps/files/src/features/files/message-brokers/rabbit/files-routing-keys.constant';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChunksFileUploader {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Take array of files uploaded by multer, divide each file by chunks and then send them to uploadChunk method which send chunk by chunk to proccessComposeFile which must be called at consumer service.
   * @param {string} routingKey - routing key for rabbitMq which link queue with exchange.
   * @param {UploadFile[]} files - array of files. The type is extended from Express.Multer.File and modified
   * @param {string} filesServiceUploadFolderWithoutBasePath - part of path(smth like userIdfolder/postIdFolder) where files should be uploaded at files microservice. It will be composed with base uplods path
   * @param {string} uploadServiceUrl - full path to files service
   * @returns {Promise<void>}
   */
  async proccessChunksUpload(
    routingKey: FilesRoutingKeys,
    files: UploadFile[],
    filesServiceUploadFolderWithoutBasePath: string,
    uploadServiceUrl: string,
  ): Promise<void> {
    console.log('🚀 ~ ChunksFileUploader ~ routingKey:', routingKey);
    // devide files on chunks
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

  /**
   * Upload file's chunks obe-by-one to file service
   * @param {string} routingKey - routing key for rabbitMq which link queue with exchange.
   * @param {string} chunk - file chunk in Buffer
   * @param {number} totalChunks - number of total chunks which file was devided to
   * @param {number} currentChunk - number of current chunk
   * @param {number} filesCount - total number of files
   * @param {number} currentFile - number of current file
   * @param {UploadFile} file - current file object
   * @param {string} filesServiceUploadFolderWithoutBasePath - part of path(smth like userIdfolder/postIdFolder) where files should be uploaded at files microservice. It will be composed with base uplods path
   * @param {string} uploadServiceUrl - full path to files service
   * @returns {Promise<void>}
   */
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
    console.log('🚀 ~ ChunksFileUploader ~ file:', file);
    console.log(
      '🚀 ~ ChunksFileUploader ~ uploadServiceUrl:',
      uploadServiceUrl,
    );
    // upload chunk to files microservice
    const pathToFile = [
      filesServiceUploadFolderWithoutBasePath,
      file.originalname,
    ].join('/');
    console.log('🚀 ~ ChunksFileUploader ~ pathToFile:', pathToFile);
    const chunkedFileDto: ChunkedFileDto = {
      environment:
        process.env.NODE_ENV === 'DEVELOPMENT'
          ? 'dev'
          : process.env.NODE_ENV === 'TESTING'
            ? 'test'
            : 'prod',
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

    // await firstValueFrom(
    await axios.post(uploadServiceUrl, chunkedFileDto);
    // );
  }

  /**
   * Get chunks at file service, save them to disk, then when all chunks will be delivered(currentChunk===totalChunks) - starts the proccess of composing this chunked file to single file using assembleChunks method
   * @param {ChunkedFileDto} chunkedFileDto - file: ChunkedFileDto type
   * @returns {Promise<void>}
   */
  async proccessComposeFile(chunkedFileDto: ChunkedFileDto): Promise<void> {
    console.log(
      '🚀 ~ ChunksFileUploader ~ proccessComposeFile ~ chunkedFileDto:',
      chunkedFileDto,
    );
    const CHUNKS_DIR = this.configService.get('FILES_SERVICE_CHUNKS_DIR');
    console.log(
      '🚀 ~ ChunksFileUploader ~ proccessComposeFile ~ CHUNKS_DIR:',
      CHUNKS_DIR,
    );
    const chunksPath = `${CHUNKS_DIR}/${chunkedFileDto.filesServiceUploadFolderWithoutBasePath}`;
    const uploadsPath = `${chunkedFileDto.filesUploadBaseDir}/${chunkedFileDto.pathToFile}`;
    console.log(
      '🚀 ~ ChunksFileUploader ~ proccessComposeFile ~ chunksPath:',
      chunksPath,
    );
    console.log(
      '🚀 ~ ChunksFileUploader ~ proccessComposeFile ~ uploadsPath:',
      uploadsPath,
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
      // write chunk to file
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

  /**
   * compose chunked file to single file, on success delete folder with chunks
   * @param {string} filename - filename
   * @param {number} totalChunks - number of total chunks which file was devided to
   * @param {string} chunksDirPath - path to dir with chunks which should be deleted after end of composing chunks to the file
   * @param {string} uploadsPath - path to file service where the file must be uploaded
   * @returns {Promise<void>}
   */
  private async assembleChunks(
    filename: string,
    totalChunks: number,
    chunksDirPath: string,
    uploadsPath: string,
  ): Promise<void> {
    try {
      // write chunk files to file
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

import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import fs from 'node:fs/promises';
import {
  IUploader,
  UploadFilesResponse,
} from '../interface/uploader.interface';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ChunkedFileDto } from 'apps/libs/common/chunks-upload/dto/chunked-file.dto';

@Injectable()
export class AwsService implements IUploader {
  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    },
    region: this.configService.get('AWS_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadFiles(file: ChunkedFileDto): Promise<UploadFilesResponse> {
    const bucketName = file.bucketName;
    const isBucketExists = await this.isBucketExists(
      bucketName,
      this.configService.get('AWS_CCOUNT_ID'),
    );
    if (!isBucketExists) {
      await this.createBucket(bucketName);
    }

    const pathToFile = [file.filesUploadBaseDir, file.pathToFile].join('/');
    const openFile = await fs.open(pathToFile, 'r');
    const readable = openFile.createReadStream();
    const chunks = [];
    for await (const chunk of readable) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const client = new Upload({
      client: this.s3Client,
      params: {
        Body: buffer,
        ContentLength: file.size,
        Bucket: bucketName,
        ContentType: file.mimetype,
        Key: [file.fileType, file.pathToFile].join('/'),
      },
    });

    const result = await client.done();
    // throw Error();
    return {
      url: result.Location,
      fileName: file.originalname,
      fileId: file?.fileId,
      folderPath: file.filesServiceUploadFolderWithoutBasePath,
    } satisfies UploadFilesResponse;
  }
  // todo! if files array passed delete only this files , else all folder
  async deleteFiles(path: string, files?: string[]): Promise<void> {
    // check if files exists in folder or check delete behavior if files does not exist
  }

  async createBucket(bucketName: string): Promise<string> {
    const input = {
      Bucket: bucketName,
      LocationConstraint: this.configService.get('AWS_REGION'),
      Location: {
        Type: 'AvailabilityZone',
        Name: 'STRING_VALUE',
      },
    };
    try {
      const command = new CreateBucketCommand(input);
      const newBucket = await this.s3Client.send(command);
      return newBucket.Location;
    } catch (err) {
      throw new HttpException(err.Code, err.$metadata.httpStatusCode);
    }
  }

  async isBucketExists(
    bucketName: string,
    accountId: string,
  ): Promise<boolean> {
    const input = {
      Bucket: bucketName,
      ExpectedBucketOwner: accountId,
    };
    try {
      const command = new HeadBucketCommand(input);
      await this.s3Client.send(command);
      return true;
    } catch (err) {
      return false;
    }
  }

  async isFolderExists(bucketName: string, path: string): Promise<boolean> {
    const input = {
      Bucket: bucketName,
      Prefix: path,
      MaxKeys: 1,
    };
    const command = new ListObjectsV2Command(input);
    const result = await this.s3Client.send(command);
    if (result.KeyCount > 0) return true;
    return false;
  }

  async listObjects(bucketName: string, path: string) {
    const input = {
      Bucket: bucketName,
      Prefix: path,
    };
    const command = new ListObjectsV2Command(input);
    const { Contents } = await this.s3Client.send(command);
    return Contents;
  }

  async deleteFolder(bucketName: string, path: string): Promise<boolean> {
    const isFolderExists = await this.isFolderExists(bucketName, path);
    // folder does not exist === deleted
    {
      if (!isFolderExists) return true;
    }
    const content = await this.listObjects(bucketName, path);

    try {
      for (let i = 0; i < content.length; i++) {
        const element = content[i];
        // if (i === 4) {
        //   throw Error();
        // }
        // todo! if during deleting some files left post will not be deleted from db, need to launch smth like outbox
        await this.s3Client.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: element.Key }),
        );
      }
      return true;
    } catch (err) {
      throw new InternalServerErrorException(
        `AwsService deleteFolder error: bucket:${bucketName} `,
      );
    }
  }
}

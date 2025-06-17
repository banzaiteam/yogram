import { HttpException, Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import {
  IUploader,
  UploadFilesResponse,
} from '../interface/uploader.interface';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  HeadBucketCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';
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

  async uploadFiles(
    file: ChunkedFileDto,
    bucket: AwsBuckets,
  ): Promise<UploadFilesResponse> {
    const isBucketExists = await this.isBucketExists(
      bucket,
      this.configService.get('AWS_CCOUNT_ID'),
    );
    if (!isBucketExists) {
      await this.createBucket(bucket);
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
        Bucket: bucket,
        Key: `${file.pathToFile}`,
      },
    });

    const result = await client.done();
    return {
      url: result.Location,
      fileName: file.originalname,
      fileId: file.fileId,
      folderPath: file.folderPath,
    };
  }

  async createBucket(name: string): Promise<string> {
    const input = {
      Bucket: name,
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

  async isBucketExists(name: string, accountId: string): Promise<boolean> {
    const input = {
      Bucket: name,
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
}

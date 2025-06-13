import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async uploadFiles(path: string, files: any): Promise<UploadFilesResponse> {
    console.log('AwsService');
    return;
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

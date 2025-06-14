import { Module } from '@nestjs/common';
import { IUploader } from './interface/uploader.interface';
import { UploadProvidersFactory } from './upload-providers-factory';
import { AwsService } from './aws/aws.service';
import { GoogleService } from './google/google.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    UploadProvidersFactory,
    AwsService,
    GoogleService,
    {
      provide: IUploader,
      inject: [UploadProvidersFactory],
      useFactory: (uploadProvidersFactory: UploadProvidersFactory) => {
        return uploadProvidersFactory.getUploadService();
      },
    },
  ],
  exports: [IUploader],
})
export class UploadProvidersModule {}

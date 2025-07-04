import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FilesController } from './api/files.controller';
import { HttpModule } from '@nestjs/axios';
import { UploadProvidersModule } from './providers/upload-providers.module';
import { FilesCommandService } from '../../files-command.service';
import { ChunksFileUploader } from 'apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { GateService } from 'apps/libs/gateService';
import { RabbitProducerModule } from 'apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import {
  UploadFilesCommand,
  UploadFilesCommandHandler,
} from './use-case/commands/upload-files.handler';
import {
  DeleteFilesCommand,
  DeleteFilesCommandHandler,
} from './use-case/commands/delete-files.handler';

@Module({
  imports: [
    HttpModule,
    UploadProvidersModule,
    CqrsModule,
    RabbitProducerModule.register(['posts']),
  ],
  controllers: [FilesController],
  providers: [
    DeleteFilesCommand,
    DeleteFilesCommandHandler,
    FilesCommandService,
    ChunksFileUploader,
    GateService,
    UploadFilesCommand,
    UploadFilesCommandHandler,
  ],
})
export class FilesModule {}

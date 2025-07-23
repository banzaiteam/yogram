import { Module } from '@nestjs/common';
import { FilesController } from './features/files/api/files.controller';
import { FilesCommandService } from './files-command.service';
import { UploadProvidersModule } from './features/files/providers/upload-providers.module';
import { ChunksFileUploader } from '../../../apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../apps/libs/gateService';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UploadFilesCommand,
  UploadFilesCommandHandler,
} from './features/files/use-case/commands/upload-files.handler';
import { RabbitProducerModule } from '../../../apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import {
  DeleteFilesCommand,
  DeleteFilesCommandHandler,
} from './features/files/use-case/commands/delete-files.handler';
import {
  GetFilesUrlHandler,
  GetFilesUrlQuery,
} from './features/files/use-case/query/get-files-url.handler';
import { FilesQueryService } from './files-query.service';

@Module({
  imports: [
    HttpModule,
    UploadProvidersModule,
    CqrsModule,
    RabbitProducerModule.register(['posts', 'files']),
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
    GetFilesUrlHandler,
    GetFilesUrlQuery,
    FilesQueryService,
  ],
})
export class FilesModule {}

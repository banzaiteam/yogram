import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FilesController } from './api/files.controller';
import { HttpModule } from '@nestjs/axios';
import { UploadProvidersModule } from './providers/upload-providers.module';
import { FilesCommandService } from '../../files-command.service';
import { ChunksFileUploader } from 'apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { GateService } from 'apps/libs/gateService';
import {
  UploadFilesCommand,
  UploadFilesCommandHandler,
} from './use-case/commands/upload-files.handler';

@Module({
  imports: [HttpModule, UploadProvidersModule, CqrsModule],
  controllers: [FilesController],
  providers: [
    FilesCommandService,
    ChunksFileUploader,
    GateService,
    UploadFilesCommand,
    UploadFilesCommandHandler,
  ],
})
export class FilesModule {}

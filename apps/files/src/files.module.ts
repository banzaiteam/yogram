import { Module } from '@nestjs/common';
import { FilesController } from './features/files/api/files.controller';
import { FilesService } from './files.service';
import { UploadProvidersModule } from './features/files/providers/upload-providers.module';
import { ChunksFileUploader } from 'apps/libs/common/upload/chunks-file-uploader.service';
import { HttpModule } from '@nestjs/axios';
import { GateService } from 'apps/libs/gateService';

@Module({
  imports: [HttpModule, UploadProvidersModule],
  controllers: [FilesController],
  providers: [FilesService, ChunksFileUploader, GateService],
})
export class FilesModule {}

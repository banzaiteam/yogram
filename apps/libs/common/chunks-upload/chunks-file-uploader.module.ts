import { Module } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { ChunksFileUploader } from './chunks-file-uploader.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ChunksFileUploader, GateService],
  exports: [GateService, ChunksFileUploader],
})
export class ChunksFileUploaderModule {}

import { Controller, Post } from '@nestjs/common';
import { FilesService } from '../../../files.service';
import { IUploader } from '../providers/interface/uploader.interface';

@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly uploadService: IUploader,
  ) {}

  @Post('files/upload')
  async uploadFile() {
    await this.uploadService.uploadFiles('path', 'ddd');
  }
}

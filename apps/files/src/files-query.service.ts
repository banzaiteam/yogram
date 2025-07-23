import { Injectable } from '@nestjs/common';
import { IUploader } from './features/files/providers/interface/uploader.interface';
import { GetFilesUrlDto } from '../../../apps/libs/Files/dto/get-files.dto';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesQueryService {
  constructor(
    private readonly uploaderService: IUploader,
    private readonly configService: ConfigService,
  ) {}
  async getFilesUrl(path: string, bucketName: string): Promise<GetFilesUrlDto> {
    const prefix = this.configService.get('UPLOAD_SERVICE_URL_PREFIX');
    const files = await this.uploaderService.listObjects(bucketName, path);
    const urls = files.map((key) => ({ url: [prefix, key.Key].join('/') }));
    return plainToInstance(GetFilesUrlDto, urls);
  }
}

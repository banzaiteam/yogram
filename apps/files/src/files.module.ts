import { Module } from '@nestjs/common';
import { FilesController } from './features/files/api/files.controller';
import { FilesService } from './files.service';
import { UploadProvidersModule } from './features/files/providers/upload-providers.module';

@Module({
  imports: [UploadProvidersModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

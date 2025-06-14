import { Module } from '@nestjs/common';
import { FilesController } from './features/files/api/files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

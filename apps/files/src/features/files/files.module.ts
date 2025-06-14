import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FilesController } from './api/files.controller';

@Module({
  imports: [CqrsModule],
  controllers: [FilesController],
})
export class FilesModule {}

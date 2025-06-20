import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';

import { UploadProvidersModule } from '../providers/upload-providers.module';
import { ChunksFileUploader } from '../../../../../../apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { HttpModule } from '@nestjs/axios';
import { CqrsModule } from '@nestjs/cqrs';

describe('FilesController', () => {
  let filesController: FilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, HttpModule, UploadProvidersModule],
      controllers: [FilesController],
      providers: [ChunksFileUploader],
    }).compile();

    filesController = app.get<FilesController>(FilesController);
  });

  describe.skip('root', () => {
    it('toBeDefined', async () => {
      expect(filesController).toBeDefined();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from '../../../files-command.service';
import { UploadProvidersModule } from '../providers/upload-providers.module';

describe('FilesController', () => {
  let filesController: FilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UploadProvidersModule],
      controllers: [FilesController],
      providers: [FilesService],
    }).compile();

    filesController = app.get<FilesController>(FilesController);
  });

  describe('root', () => {
    it('toBeDefined', async () => {
      expect(filesController).toBeDefined();
    });
  });
});

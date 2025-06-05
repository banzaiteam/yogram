import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('UsersController', () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe.skip('root', () => {
    it('should return "Hello World!"', () => { });
  });
});

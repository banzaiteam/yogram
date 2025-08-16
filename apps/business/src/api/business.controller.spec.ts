import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessCommandService } from '../business-command.service';

describe('BusinessController', () => {
  let businessController: BusinessController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [BusinessCommandService],
    }).compile();

    businessController = app.get<BusinessController>(BusinessController);
  });

  describe.skip('root', () => {
    it('should return "Hello World!"', () => {
      // expect(businessController.getHello()).toBe('Hello World!');
    });
  });
});

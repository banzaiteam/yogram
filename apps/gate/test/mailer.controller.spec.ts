import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from '../../../apps/mailer/src/api/mailer.controller';

describe('MailerController', () => {
  let mailerController: MailerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [MailerService],
    }).compile();

    mailerController = app.get<MailerController>(MailerController);
  });

  describe('root', () => {
    it.skip('should return "Hello World!"', () => {
      expect(mailerController.sendUserVerifyEmail).toBe('Hello World!');
    });
  });
});

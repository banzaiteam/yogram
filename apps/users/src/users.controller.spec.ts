import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersCommandService } from './users-command.service';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersCommandService],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe.skip('root', () => {
    it.skip('should return "Hello World!"', () => {
      expect(
        usersController.findOneById({
          id: '55a52cd8-31d7-4cb6-a663-73d7004bdd4e',
        }),
      ).toBe('Hello Users!');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersCommandService } from './users-command.service';
import { DataSource } from 'typeorm';
import { IUserCommandRepository } from './interfaces/command/user-command.interface';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersCommandService,
        { provide: DataSource, useValue: jest.fn() },
        { provide: IUserCommandRepository, useValue: jest.fn() },
        { provide: IProfileCommandRepository, useValue: jest.fn() },
        { provide: CommandBus, useValue: jest.fn() },
        { provide: QueryBus, useValue: jest.fn() },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe.skip('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        usersController.findOneById({
          id: '55a52cd8-31d7-4cb6-a663-73d7004bdd4e',
        }),
      ).toBe('Hello Users!');
    });
  });
});

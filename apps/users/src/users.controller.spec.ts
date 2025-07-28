import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersCommandService } from './users-command.service';
import { DataSource } from 'typeorm';
import { IUserCommandRepository } from './interfaces/command/user-command.interface';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChunksFileUploader } from '../../../apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { ProfileCommandService } from './profile-command.service';
import { ProviderCommandService } from './provider-command.service';
import { UsersQueryService } from './users-query.service';
import { ConfigService } from '@nestjs/config';
import { ProviderQueryService } from './provider-query.service';

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
        {
          provide: ChunksFileUploader,
          useValue: jest.fn(),
        },
        {
          provide: ProfileCommandService,
          useValue: jest.fn(),
        },
        {
          provide: ProviderCommandService,
          useValue: jest.fn(),
        },
        {
          provide: UsersQueryService,
          useValue: jest.fn(),
        },
        {
          provide: ProviderQueryService,
          useValue: jest.fn(),
        },
        {
          provide: QueryBus,
          useValue: jest.fn().mockResolvedValueOnce({
            execute: jest.fn(),
          }),
        },
        {
          provide: ConfigService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe.skip('root', () => {
    it('should return "Hello World!"', () => {
      expect(
        usersController.findUserByCriteria({
          id: '55a52cd8-31d7-4cb6-a663-73d7004bdd4e',
        }),
      ).toBe('Hello Users!');
    });
  });
});

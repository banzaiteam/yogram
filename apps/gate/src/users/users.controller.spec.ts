import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, GateService, ConfigService, HttpService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

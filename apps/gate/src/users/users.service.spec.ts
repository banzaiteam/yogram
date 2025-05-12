import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [UsersService, GateService, HttpService, ConfigService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});

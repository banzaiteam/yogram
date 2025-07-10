import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../../apps/libs/gateService';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ProducerService } from '../../../../apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { ConfigModule } from '@nestjs/config';
import {
  RabbitProducerModule,
  RMQ_PRODUCER_QUEUE_LIST,
} from '../../../../apps/libs/common/message-brokers/rabbit/rabbit-producer.module';
import { PostsService } from '../posts/posts.service';

describe('SignupService', () => {
  let service: SignupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        SignupService,
        GateService,
        UsersService,
        JwtService,
        PostsService,
        ProducerService,
        {
          provide: RMQ_PRODUCER_QUEUE_LIST,
          useValue: jest.fn().mockReturnValue('user'),
        },
      ],
    }).compile();

    service = module.get<SignupService>(SignupService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});

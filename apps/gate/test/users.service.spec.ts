import { Test, TestingModule } from '@nestjs/testing';
import { UsersCommandService } from '../../users/src/users-command.service';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { faker } from '@faker-js/faker/.';
import { IUserCommandRepository } from '../../../apps/users/src/interfaces/command/user-command.interface';
import { IProfileCommandRepository } from '../../../apps/users/src/interfaces/command/profile-command.interface';
import { ProfileCommandService } from '../../../apps/users/src/profile-command.service';
import { ProviderCommandService } from '../../../apps/users/src/provider-command.service';
import { UsersQueryService } from '../../../apps/users/src/users-query.service';

const createUserDto: CreateUserDto = {
  username: 'username1',
  email: 'retouch@gmail.com',
  password: '123456Ok!',
};
const userRes = { ...createUserDto, id: faker.string.uuid };

describe('Users Service', () => {
  let service: UsersCommandService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersCommandService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValueOnce({
              startTransaction: jest.fn(),
              release: jest.fn(),
              rollbackTransaction: jest.fn(),
              commitTransaction: jest.fn(),
            }),
          },
        },
        {
          provide: IUserCommandRepository,
          useValue: {
            create: jest.fn().mockResolvedValueOnce(userRes),
          },
        },
        {
          provide: IProfileCommandRepository,
          useValue: { create: jest.fn() },
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
      ],
    }).compile();
    service = module.get(UsersCommandService);
  });
  it.skip('should to be defined', async () => {
    expect(service).toBeDefined();
  });

  it.skip('should bla-bla', async () => {
    // const spy = jest.spyOn(service, 'createUser');
    // await service.createUser(createUserDto);
    // expect(spy).toHaveBeenCalledTimes(1);
    // expect(spy).toHaveBeenCalledWith(createUserDto);
  });
});

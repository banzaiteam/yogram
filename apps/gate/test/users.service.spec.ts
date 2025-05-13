import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/src/users.service';
import { DataSource } from 'typeorm';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { faker } from '@faker-js/faker/.';
import { IUserCommandRepository } from 'apps/users/src/interfaces/command/user-command.interface';
import { IProfileCommandRepository } from 'apps/users/src/interfaces/command/profile-command.interface';

const createUserDto: CreateUserDto = {
  firstName: 'Ivans',
  lastName: 'Ivanov',
  username: 'mmm',
  email: 'retouch226@gmail.com',
  description: 'fffff',
  password: '12O!k',
  birthdate: new Date(),
  city: 'Khm',
  country: 'Prague',
};
const userRes = { ...createUserDto, id: faker.string.uuid };

describe('Users Service', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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
      ],
    }).compile();
    service = module.get(UsersService);
  });
  it.skip('should to be defined', async () => {
    expect(service).toBeDefined();
  });

  it.skip('should bla-bla', async () => {
    const spy = jest.spyOn(service, 'createUser');
    await service.createUser(createUserDto);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(createUserDto);
  });
});

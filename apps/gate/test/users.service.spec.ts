import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { IUserCommandRepository } from './interfaces/users-command.interface';
import { IProfileCommandRepository } from './interfaces/profile-command.interface';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { release } from 'os';
import { faker } from '@faker-js/faker/.';
import { RpcException } from '@nestjs/microservices';

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

// const datasourceMock = () => jest.fn(()=>{
//   createQueryRunner: jest.fn().mockImplementation(() => ({
//     startTransaction: jest.fn(),
//   })),
// });

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
  it('should to be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should bla-bla', async () => {
    const spy = jest.spyOn(service, 'createUser');
    await service.createUser(createUserDto);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(createUserDto);
  });
});

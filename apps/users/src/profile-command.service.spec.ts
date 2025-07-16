import { Test, TestingModule } from '@nestjs/testing';
import { ProfileCommandService } from './profile-command.service';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { NotFoundException } from '@nestjs/common';
import { User } from './infrastructure/entity/User.entity';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { CreateProfileDto } from 'apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from 'apps/libs/Users/dto/profile/update-profile.dto';
import { ResponseProfileDto } from 'apps/libs/Users/dto/user/response-profile.dto';

const subscriberUser = {
  id: 'be225a5f-e127-49d8-ad00-d49830af654d',
  username: '1234ghy',
  email: 'retouch226@gmail.com',
  url: null,
  verified: true,
  profile: {
    id: '2440fab8-6d61-4c1a-8abf-02a0e7f8961c',
    aboutMe: null,
    username: '1234ghy',
  },
};

const profileTOSubscribeOn = {
  id: '24d033ff-ac03-4b46-b1b2-09282f57c813',
  createdAt: '2025-07-12',
  updatedAt: '2025-07-12',
  deletedAt: null,
  username: 'Vvv567f2e3',
  aboutMe: null,
};

const subscribeResponse = {
  id: '2440fab8-6d61-4c1a-8abf-02a0e7f8961c',
  subscribedTo: [
    {
      id: '24d033ff-ac03-4b46-b1b2-09282f57c813',
      createdAt: '2025-07-12',
      updatedAt: '2025-07-12',
      deletedAt: null,
      username: 'Vvv567f2e3',
      aboutMe: null,
    },
  ],
};

const mockUserRepository = {
  findOne: jest.fn(),
  findUserByCriteria: jest.fn(),
};

const mockProfileRepository = {
  findOne: jest.fn(),
};

describe('Profile Command Service', () => {
  let service: ProfileCommandService;
  let userRepository: IUsersQueryRepository<User, ResponseUserDto>;
  let profileRepository: IProfileCommandRepository<
    CreateProfileDto,
    UpdateProfileDto,
    ResponseProfileDto
  >;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileCommandService,
        {
          provide: IUsersQueryRepository,
          useValue: mockUserRepository,
        },
        {
          provide: IProfileCommandRepository,
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = app.get<ProfileCommandService>(ProfileCommandService);
    userRepository = app.get<IUsersQueryRepository<User, ResponseUserDto>>(
      IUsersQueryRepository,
    );
    profileRepository = app.get<
      IProfileCommandRepository<
        CreateProfileDto,
        UpdateProfileDto,
        ResponseProfileDto
      >
    >(IProfileCommandRepository);
  });

  describe('create', () => {
    it('define"', () => {
      expect(service).toBeDefined();
    });
    it('should sibscibe', async () => {
      jest
        .spyOn(userRepository, 'findUserByCriteria')
        .mockResolvedValueOnce(subscriberUser);
      //   jest
      //     .spyOn(profileRepository, 'findOne')
      //     .mockResolvedValueOnce(profileTOSubscribeOn);
      const subscribed = await service.subscribe(
        subscriberUser.id,
        profileTOSubscribeOn.id,
      );
      console.log('🚀 ~ it ~ subscribed:', subscribed);
      expect(subscribed).toEqual(subscribeResponse);
    });
  });

  describe('throws', () => {
    it('should throw ProfileCommandService error: user was not found', async () => {
      const ecxeption = new NotFoundException(
        'ProfileCommandService error: user was not found',
      );
      const mockMethod = jest
        .spyOn(service, 'subscribe')
        .mockRejectedValueOnce(ecxeption);
      try {
        await service.subscribe(subscriberUser.id, profileTOSubscribeOn.id);
      } catch (error) {
        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(error).toEqual(ecxeption);
      }
    });

    it('should throw ProfileCommandRepository error: profile does not exist', async () => {
      const ecxeption = new NotFoundException(
        'ProfileCommandRepository error: profile does not exist',
      );
      const mockMethod = jest
        .spyOn(service, 'subscribe')
        .mockRejectedValueOnce(ecxeption);
      try {
        await service.subscribe(subscriberUser.id, profileTOSubscribeOn.id);
      } catch (error) {
        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(error).toEqual(ecxeption);
      }
    });
  });
});

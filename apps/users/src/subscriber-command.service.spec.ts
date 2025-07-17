import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ResponseProfile1Dto } from 'apps/libs/Users/dto/user/response-profile.dto';
import { ISubscriberCommandRepository } from './interfaces/command/subscriber-command.interface';
import { SubscriberCommandService } from './subscriber-command.service';
import { Profile } from './infrastructure/entity/Profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileCommandRepository } from './infrastructure/repository/command/profile-command.repository';
import { UsersQueryService } from './users-query.service';
import { SubscriberQueryService } from './subscriber-query.service';
import { Subscriber } from './infrastructure/entity/Subscriber.entity';

const subscriberUser = {
  id: 'be225a5f-e127-49d8-ad00-d49830af654d',
  username: '1234ghy',
  email: 'retouch226@gmail.com',
  url: 'url...',
  verified: true,
  profile: {
    id: '2440fab8-6d61-4c1a-8abf-02a0e7f8961c',
    aboutMe: null,
    username: '1234ghy',
  },
};

const profileTOSubscribeOn = {
  id: '24d033ff-ac03-4b46-b1b2-09282f57c813',
  username: 'Vvv567f2e3',
  aboutMe: null,
  user: {
    url: 'url...',
  },
} satisfies ResponseProfile1Dto;

const getSubscribedOnResponse = {
  subscriber: {
    id: '2440fab8-6d61-4c1a-8abf-02a0e7f8961c',
    url: 'url...',
    username: '1234ghy',
  },
  subscribed: [
    {
      id: '24d033ff-ac03-4b46-b1b2-09282f57c813',
      url: 'url...',
      username: 'Vvv567f2e3',
    },
  ],
};

const subscribeResponse = {
  subscriberId: '2440fab8-6d61-4c1a-8abf-02a0e7f8961c',
  subscriberUrl: null,
  subscriberUsername: '1234ghy',
  subscribedId: '24d033ff-ac03-4b46-b1b2-09282f57c813',
  subscribedUrl:
    'https://yogram-files.s3.eu-north-1.amazonaws.com/dev/avatars/921a05c4-b949-4994-a4ca-6820f3774bea/DSC03265-1752316019097-59877053.JPG',
  subscribedUsername: 'Vvv567f2e3',
};

const mockUserRepository = {
  findOne: jest.fn(),
  findUserByCriteria: jest.fn(),
};

const mockProfileRepository = {
  findOne: jest.fn(),
};

const mockSubscriberRepository = {
  subscribe: jest.fn(),
};

const mockSubscriberQueryService = {
  getAllSubscribedOn: jest.fn(),
};

describe('Subscriber Command Service', () => {
  let service: SubscriberCommandService;
  let usersQueryService: UsersQueryService;
  let profileRepository: ProfileCommandRepository;
  let subscriberCommandRepository: ISubscriberCommandRepository;
  let subscriberQueryService: SubscriberQueryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriberCommandService,
        ProfileCommandRepository,
        SubscriberQueryService,
        UsersQueryService,
        {
          provide: ISubscriberCommandRepository,
          useValue: mockSubscriberRepository,
        },
        {
          provide: UsersQueryService,
          useValue: mockUserRepository,
        },
        {
          provide: SubscriberQueryService,
          useValue: mockSubscriberQueryService,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(Subscriber),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = app.get<SubscriberCommandService>(SubscriberCommandService);
    usersQueryService = app.get<UsersQueryService>(UsersQueryService);
    profileRepository = app.get(getRepositoryToken(Profile));
    subscriberCommandRepository = app.get(ISubscriberCommandRepository);
  });

  describe.skip('create', () => {
    it('define"', () => {
      expect(service).toBeDefined();
    });
    it('should sibscribe', async () => {
      jest
        .spyOn(usersQueryService, 'findUserByCriteria')
        .mockResolvedValueOnce(subscriberUser);
      jest
        .spyOn(profileRepository, 'findOne')
        .mockResolvedValueOnce(profileTOSubscribeOn);
      const spy = jest.spyOn(service, 'subscribe');
      const subscribed = await service.subscribe(
        subscriberUser.id,
        profileTOSubscribeOn.id,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(subscribed).toEqual(undefined);
    });
  });

  describe.skip('throws', () => {
    it('should throw ProfileCommandService error: user was not found', async () => {
      const ecxeption = new NotFoundException(
        'ProfileCommandService error: user was not found',
      );
      const mockMethod = jest.spyOn(service, 'subscribe');
      jest
        .spyOn(usersQueryService, 'findUserByCriteria')
        .mockRejectedValueOnce(ecxeption);

      try {
        await service.subscribe(subscriberUser.id, profileTOSubscribeOn.id);
      } catch (error) {
        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(error).toEqual(ecxeption);
      }
    });

    it('should throw ProfileCommandService error: subscriber  user was not foundd', async () => {
      const ecxeption = new NotFoundException(
        'ProfileCommandService error: subscriber  user was not found',
      );
      const mockMethod = jest.spyOn(service, 'subscribe');
      jest.spyOn(profileRepository, 'findOne').mockRejectedValueOnce(ecxeption);
      try {
        await service.subscribe(subscriberUser.id, profileTOSubscribeOn.id);
      } catch (error) {
        expect(mockMethod).toHaveBeenCalledTimes(1);
        expect(error).toEqual(ecxeption);
      }
    });
  });
});

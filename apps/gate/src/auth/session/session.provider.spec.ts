import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { REDIS_CLIENT } from '../../../../../apps/libs/common/redis/redis-client.factory';
import Redis from 'ioredis';
import { SessionProvider } from './session.provider';

const createdSession = {
  deviceId: 'safari 10.1',
  ip: '::1',
  active: true,
  userId: '5e91b8e5-cfc7-4663-b0cd-2a7313f27c06',
};

const device1 = JSON.stringify({
  userId: '5e91b8e5-cfc7-4663-b0cd-2a7313f27c06',
  deviceId: '::1-Safari 15.5',
  ip: '::1',
});
const device2 = JSON.stringify({
  userId: '5e91b8e5-cfc7-4663-b0cd-2a7313f27c06',
  deviceId:
    '::1-Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605',
});
const devices = [device1, device2];

describe('Session provider', () => {
  const mockRedisService = createMock<Redis>();
  const jwtSetvice = createMock<typeof JwtService>(JwtService);
  let sessionProvider: SessionProvider;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionProvider,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisService,
        },
        {
          provide: JwtService,
          useValue: jwtSetvice,
        },
      ],
    }).compile();
    sessionProvider = module.get(SessionProvider);
  });
  it.skip('should be defined', async () => {
    expect(sessionProvider).toBeDefined();
  });
  it.skip('should create new session and device', async () => {
    jest.spyOn(mockRedisService, 'hset').mockResolvedValueOnce(4);
    jest.spyOn(mockRedisService, 'expire').mockResolvedValueOnce(1);
    const spy = jest.spyOn(sessionProvider, 'createDeviceSession');
    try {
      await sessionProvider.createDeviceSession(
        'token',
        createdSession,
        1234567,
      );
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('token', createdSession, 1234567);
    } catch (error) {
      expect(error).toEqual(undefined);
    }
  });

  it.skip('should return all user devices', async () => {
    const spy = jest.spyOn(sessionProvider, 'getAllUserDevices');
    jest.spyOn(mockRedisService, 'smembers').mockResolvedValueOnce(devices);
    const devicesRes = await sessionProvider.getAllUserDevices(
      '5e91b8e5-cfc7-4663-b0cd-2a7313f27c06',
    );
    expect(devicesRes).toEqual(devices.map((dev) => JSON.parse(dev)));
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

const mockContextSuccess = {
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getRequest: () => ({
    headers: { authorization: 'Bearer token' },
    query: { limit: 2, page: 1 },
  }),
} as any;

const mockContextThrow = {
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getRequest: () => ({
    headers: { authorization: '' },
    query: { limit: 2, page: 1 },
  }),
} as any;

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValueOnce(false),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();
    authGuard = module.get(AuthGuard);
  });
  describe.skip('success', () => {
    it('should be defined', async () => {
      expect(authGuard).toBeDefined();
    });
    it('should return true', async () => {
      const mockExecutionContext = createMock<ExecutionContext>();
      const mmm = jest
        .spyOn(mockExecutionContext, 'switchToHttp')
        .mockReturnValueOnce(mockContextSuccess);
      const res = await authGuard.canActivate(mockExecutionContext);
      expect(res).toEqual(true);
      mmm.mockRestore();
    });
  });
  describe.skip('throw', () => {
    it('should throw UnauthorizedException', async () => {
      try {
        const mockExecutionContext = createMock<ExecutionContext>();
        const mmm = jest
          .spyOn(mockExecutionContext, 'switchToHttp')
          .mockReturnValueOnce(mockContextThrow);
        await authGuard.canActivate(mockExecutionContext);
        mmm.mockRestore();
      } catch (err) {
        expect(err).toEqual(new UnauthorizedException());
      }
    });
    it.skip('should throw UnauthorizedException because of jwt', async () => {
      try {
        const mockExecutionContext = createMock<ExecutionContext>();
        const mmm = jest
          .spyOn(mockExecutionContext, 'switchToHttp')
          .mockReturnValueOnce(mockContextSuccess);
        await authGuard.canActivate(mockExecutionContext);
        mmm.mockRestore();
      } catch (err) {
        expect(err).toEqual(new UnauthorizedException());
      }
    });
  });
});

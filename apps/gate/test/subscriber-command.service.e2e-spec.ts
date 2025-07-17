import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersModule } from '../../../apps/users/src/users.module';
import { SubscriberCommandService } from '../../../apps/users/src/subscriber-command.service';

let subscribeTo = '24d033ff-ac03-4b46-b1b2-09282f57c813';
const mockSubscriberCommandService = {
  subscribe: jest.fn(),
};

describe('Session e2e', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Subscribe Success', () => {
    it('Subscribe to profile (POST /users/subscribe)', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
      let accessToken = authResponse.body.accessToken;

      await request(app.getHttpServer())
        .post('/users/subscribe')
        .send({ subscribeTo })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);
    });
  });

  describe('Subscribe Exceptions', () => {
    it('should throw ProfileCommandService error: subscriber  user was not found', async () => {
      const exception = new NotFoundException(
        'ProfileCommandService error: profile to subscribe on was not found',
      );

      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
      let accessToken = authResponse.body.accessToken;
      const subscribeTo = '24d033ff-ac03-4b46-b1b2-09282f57c814';

      const response = await request(app.getHttpServer())
        .post('/users/subscribe')
        .send({ subscribeTo })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
      expect(response.body.message).toEqual(exception.message);
    });
  });
});

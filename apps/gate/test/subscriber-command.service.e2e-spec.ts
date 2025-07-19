import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpUsersPath } from '../../../apps/libs/Users/constants/path.enum';

let subscriber = 'be225a5f-e127-49d8-ad00-d49830af654d';
let subscribeTo = '24d033ff-ac03-4b46-b1b2-09282f57c813';
let unsubscribeFrom = '24d033ff-ac03-4b46-b1b2-09282f57c813';
const mockSubscriberCommandService = {
  subscribe: jest.fn(),
};

describe('Subscriber e2e', () => {
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

  describe.skip('Subscribe Success', () => {
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

  describe.skip('Get All Subscriptions', () => {
    it('GET (GET /users/unsubscribe)', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
      let accessToken = authResponse.body.accessToken;

      const response = await request(app.getHttpServer())
        .get('/users/subscriptions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      console.log('🚀 ~ it ~ response:', response.body);
      expect(response).not.toBe(undefined);
    });
  });

  describe.skip('Subscribe delete', () => {
    it('Delete (DELETE /users/unsubscribe)', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
      let accessToken = authResponse.body.accessToken;

      await request(app.getHttpServer())
        .delete('/users/unsubscribe')
        .send({ unsubscribeFrom })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe.skip('Subscribe Exceptions', () => {
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

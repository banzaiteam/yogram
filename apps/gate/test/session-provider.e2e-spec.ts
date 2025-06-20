import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { UsersModule } from '../../../apps/users/src/users.module';

describe('Session e2e', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  // afterAll(async () => {
  //   await app.close();
  // });
  describe.skip('Create Session', () => {
    it('Create (POST /)', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send({
          email: 'anything@banzaiteam777-personal-qbnz.imitate.email',
          username: 'username1',
          password: '1234Ok!',
        })
        .expect(HttpStatus.CREATED);
    });
  });
});

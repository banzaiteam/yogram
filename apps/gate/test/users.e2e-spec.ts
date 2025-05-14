import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersModule as UsersAppModule } from '../../users/src/users.module';
import { UsersModule } from '../../gate/src/users/users.module';
import { AppModule } from '../src/app.module';

const createUserDto = {
  username: 'mmm',
  email: 'retouch226@gmail.com',
  password: '12O!k',
};

describe('Users microservice (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  // localhost:3001/api/v1/
  it.skip('/ (POST)', async () => {
    const result = await request(app.getHttpServer())
      .post('/signup')
      .send(createUserDto)
      .expect(201);
  });
});

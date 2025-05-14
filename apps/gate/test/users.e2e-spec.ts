import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

const createUserDto = {
  firstName: 'Ivans',
  lastName: 'Ivanov',
  username: 'mmm',
  email: 'retouch226@gmail.com',
  'description:': 'fffff',
  password: '12O!k',
  birthdate: '10/30/20',
  city: 'Khm',
  country: 'Prague',
};

describe('Users microservice (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // localhost:3001/api/v1/
  it.skip('/ (POST)', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/create')
      .send(createUserDto)
      .expect(201);
  });
});

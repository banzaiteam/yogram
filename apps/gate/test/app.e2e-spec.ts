import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';

jest.mock('open', () => jest.fn());

const createUserDto: CreateUserDto = {
  username: 'username1',
  email: 'retouch@gmail.com',
  password: '123456Ok!',
};
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);
    // .expect('Hello World!GATE');
  });
});

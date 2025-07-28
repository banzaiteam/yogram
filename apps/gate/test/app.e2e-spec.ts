import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import FormData from 'form-data';
import fs from 'fs';
import { blob } from 'stream/consumers';

// const createUserDto: CreateUserDto = {
//   username: 'username1',
//   email: 'retouch@gmail.com',
//   password: '123456Ok!',
// };
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/ (POST)', async () => {
    const filePath = [
      '/Users/admin/Downloads/pictures/',
      'pexels-souvenirpixels-417074.jpg',
    ].join('/');
    // const file = await open(filePath, 'r');
    // const stream = file.createReadStream();
    const formData = new FormData();
    const stream = fs.createReadStream(filePath);
    const fileBlob = await blob(stream);
    const fileName = 'your_file.jpg';

    formData.append('file', fileBlob, fileName);
    // formData.append('username', 'vasa', {contentType:''});
    // formData.append('email', 'block4ain226@gmail.com');
    // formData.append('password', '24488Ok!');
    // formData.append('username', ' vasa');
    // formData.append('firstName', 'Ivan');
    // formData.append('LastName', ' Vanoff');

    return request(app.getHttpServer())
      .post('/signup')
      .send(formData)
      .set(formData.getHeaders())
      .expect(201);
    // .expect('Hello World!GATE');
  });
});

import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import FormData from 'form-data';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { AppModule as AppUsers } from '../../../apps/gate/src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(60000);
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppUsers],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('POST signup', async () => {
    const filePath = '/Users/admin/Downloads/pictures/img45.jpeg';
    const formData = new FormData();
    // const stream = fs.createReadStream(filePath);
    // const fileBlob = await blob(stream);
    // const fileName = 'your_file.jpg';
    // // formData.append('file', filePath);
    const id = v4();
    console.log('🚀 ~ id:', id);
    const response = await request(app.getHttpServer())
      .post('/signup')
      // .attach('file', filePath)
      .field('firstName', 'Ivan')
      .field('lastName', 'Ivanus')
      .field('username', 'Ivan6789')
      .field('email', 'retouch226@gmail.com')
      .field('password', '24488Ok')
      .set({ ...formData.getHeaders(), id });
    console.log('🚀 ~ response:', response.body);

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'retouch226@gmail.com', password: '24488Ok' });
    let accessToken = authResponse.body.accessToken;
    console.log('🚀 ~ accessToken:', accessToken);
    // const usersAvatars = await request(app.getHttpServer()).get(
    //   `/users/avatars/${id}`,
    // );
    // // .set('Authorization', `Bearer ${accessToken}`);
    // console.log('🚀 ~ usersAvatars:', usersAvatars.body);
  });
});

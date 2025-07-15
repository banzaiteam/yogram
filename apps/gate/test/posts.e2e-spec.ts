import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import path from 'path';

const createCommentDto = {
  postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
  userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
  text: 'bal-bla4',
  parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
  post: null,
  likes: 0,
};
describe('Posts (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/posts (POST)', async () => {
    const filePath = '/Users/admin/Downloads/pictures/insta1.jpeg';
    const filePath2 =
      '/Users/admin/Downloads/pictures/pexels-souvenirpixels-417074.jpg';
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
    let accessToken = authResponse.body.accessToken;
    console.log('🚀 ~ it ~ accessToken:', accessToken);
    const createdPost = await request(app.getHttpServer())
      .post('/posts')
      .attach('files', filePath)
      .attach('files', filePath2)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    // console.log('🚀 ~ it ~ createdPost:', createdPost);

    // const comment = request(app.getHttpServer()).get(
    //   '/posts?filter=userId:eq:fd2dcd81-8c03-4292-923e-6c4fb2543c00',
    // );
    // console.log('🚀 ~ it.skip ~ comment:', (await comment).body);
  });
});

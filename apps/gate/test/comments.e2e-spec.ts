import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

const createCommentDto = {
  postId: 'ae9b752e-732b-4e9c-9eca-e5068cd74e27',
  userId: 'fd2dcd81-8c03-4292-923e-6c4fb2543c00',
  text: 'bal-bla4',
  parentId: 'bb20fa4a-b9de-4f45-8dfc-7c8f68d2bc5a',
  post: null,
  likes: 0,
};
describe('Comments (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/posts/comments (POST)', async () => {
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
    let accessToken = authResponse.body.accessToken;

    const createdComment = request(app.getHttpServer())
      .post('/posts/comments')
      .send(createCommentDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    const commentResponse = Object.assign({}, createCommentDto);
    delete commentResponse.postId;
    delete commentResponse.post;
    expect((await createdComment).body !== undefined).toEqual(true);
  });
});

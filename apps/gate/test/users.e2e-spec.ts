import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import FormData from 'form-data';
import fs from 'fs';
import { blob } from 'stream/consumers';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../../apps/users/src/users.module';
import { v4 } from 'uuid';
import { MailerModule } from '../../../apps/mailer/src/mailer.module';
import { FilesModule } from '../../../apps/files/src/files.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(60000);
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, FilesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('POST users/create', async () => {
    const filePath = '/Users/admin/Downloads/pictures/img45.jpeg';
    const formData = new FormData();
    const stream = fs.createReadStream(filePath);
    const fileBlob = await blob(stream);
    const fileName = 'your_file.jpg';
    formData.append('file', filePath);
    const id = v4();
    const response = await request(app.getHttpServer())
      .post('/users/create')
      .attach('file', filePath)
      .field('firstName', 'Ivan')
      .field('lastName', 'Ivanus')
      .field('username', 'Ivan6789')
      .field('email', 'retouch226@gmail.com')
      .field('password', '24488Ok')
      .set({ ...formData.getHeaders(), id });

    const usersAvatars = await request(app.getHttpServer()).get(
      `/users/avatars/${id}`,
    );
    console.log('🚀 ~ usersAvatars:', usersAvatars.body);
  });
});

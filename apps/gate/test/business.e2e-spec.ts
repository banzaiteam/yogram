import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { BusinessModule } from '../../../apps/business/src/business.module';
import { BusinessCommandService } from '../../../apps/business/src/business-command.service';
import { BusinessCommandRepository } from '../../business/src/infrastructure/repository/command/business-command.repository';
import { IBusinessCommandRepository } from '../../business/src/interfaces/business-command-repository.interface';
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../../apps/business/src/infrastructure/entity/payment.entity';
import {
  UpdatePlanCommand,
  UpdatePlanHandler,
} from '../../business/src/application/command/subscribe.handler';

describe('Comments (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BusinessModule,
        DatabaseModule.register(),
        TypeOrmModule.forFeature([Payment]),
      ],
      providers: [
        BusinessCommandService,
        UpdatePlanCommand,
        UpdatePlanHandler,
        BusinessCommandRepository,
        {
          provide: IBusinessCommandRepository,
          useClass: BusinessCommandRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/business (POST)', async () => {
    // const authResponse = await request(app.getHttpServer())
    //   .post('/auth/login')
    //   .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
    // let accessToken = authResponse.body.accessToken;
    // console.log('🚀 ~ accessToken:', accessToken);
    const res = await request(app.getHttpServer())
      .post('/business/update-plan')
      .send({
        id: 'd25a77e9-1e92-469f-8e01-c325e8220cc9',
        subscriptionType: 1,
      })
      //   .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
  });
});

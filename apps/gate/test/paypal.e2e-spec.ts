import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from '../../../apps/business/src/business.module';
import { Payment } from '../../../apps/business/src/infrastructure/entity/payment.entity';
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UpdatePlanDto } from '../../../apps/libs/Business/dto/input/update-plan.dto';
import { SubscriptionType } from '../../../apps/libs/Business/constants/subscription-type.enum';
import { chromium } from 'playwright';

const userId = 'd25a77e9-1e92-469f-8e01-c325e8220cc9';
const updatePlan: UpdatePlanDto = {
  id: userId,
  subscriptionType: SubscriptionType.Month,
};

describe('Business (e2e)', () => {
  let app: INestApplication;
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  afterEach(async () => {
    await page.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({ global: true, secret: '1234' }),

        BusinessModule,
        DatabaseModule.register(),
        TypeOrmModule.forFeature([Payment]),
      ],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/business (POST)', async () => {
    // const authResponse = await request(app.getHttpServer())
    //   .get('/auth/login')
    //   .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
    // let accessToken = authResponse.body.accessToken;

    const jwt = new JwtService();
    const access_token = jwt.signAsync(userId, { secret: '1234' });

    const payment = await request(app.getHttpServer())
      .post('/business/update-plan?payment=paypal')
      .send(updatePlan);
    console.log('🚀 ~ payment:', payment.request.res.rawHeaders[3]);
    page = await browser.newPage();
    await page.goto(payment.request.res.rawHeaders[3]);
    await page.screenshot({ path: 'apps/gate/test/page.jpeg' });
    await page.waitForSelector('#btnNext', { timeout: 10000 });
    await page.fill('#email', 'sb-b11iq45370193@personal.example.com');
    await page.click('#btnNext');
    await page.screenshot({ path: 'apps/gate/test/page1.jpeg' });
    await page.fill('#password', 'IS|1f)G=');
    await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
    await page.click('#btnLogin');
    setTimeout(async () => {
      await page.screenshot({ path: 'apps/gate/test/page3.jpeg' });
    }, 2000);

    await page.waitForSelector('.Buttons_base_2xi07', {
      timeout: 10000,
    });
    await page.screenshot({ path: 'apps/gate/test/page4.jpeg' });

    await page.click('.Buttons_base_2xi07');
    setTimeout(async () => {
      await page.screenshot({ path: 'apps/gate/test/page5.jpeg' });
    }, 2000);
    // await page.waitForSelector('.mt-2', {
    //   timeout: 30000,
    // });

    // await page.screenshot({ path: 'apps/gate/test/page6.jpeg' });
    // await page.click('#one-time-cta');
    // await page.screenshot({ path: 'apps/gate/test/page7.jpeg' });
    // todo get transactions or get sse or check balance
  }, 60000);
});

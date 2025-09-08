import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessModule } from '../../../apps/business/src/business.module';
import { Payment } from '../../../apps/business/src/infrastructure/entity/payment.entity';
import { DatabaseModule } from '../../../apps/libs/common/database/database.module';
import request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SubscribeDto } from '../../libs/Business/dto/input/subscribe.dto';
import { SubscriptionType } from '../../../apps/libs/Business/constants/subscription-type.enum';
import { chromium } from 'playwright';
import { PaymentType } from '../../../apps/libs/Business/constants/payment-type.enum';

const userId = 'd25a77e9-1e92-469f-8e01-c325e8220cc9';
const updatePlan: SubscribeDto = {
  userId,
  subscriptionType: SubscriptionType.OneDay,
  paymentType: PaymentType.PAYPAL,
};

const updatePlan2: SubscribeDto = {
  userId,
  subscriptionType: SubscriptionType.SevenDays,
  paymentType: PaymentType.PAYPAL,
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

  describe('Subscription', () => {
    it('should switch first subscribe`s status from active to suspended when create second subscription', async () => {
      for (let i = 0; i < 2; i++) {
        const payment = await request(app.getHttpServer())
          .post('/business/subscribe?payment=paypal')
          .send(i === 0 ? updatePlan : updatePlan2);
        console.log('🚀 ~ payment:', payment);
        page = await browser.newPage();
        await page.goto(JSON.parse(payment['res'].text).link);
        await page.waitForSelector('#btnNext', { timeout: 10000 });
        await page.screenshot({ path: 'apps/gate/test/page.jpeg' });
        await page.fill('#email', 'sb-b11iq45370193@personal.example.com');
        await page.click('#btnNext');
        await page.waitForSelector('#btnLogin', { timeout: 10000 });
        await page.screenshot({ path: 'apps/gate/test/page1.jpeg' });
        await page.fill('#password', 'IS|1f)G=');
        await page.click('#btnLogin');
        await page.waitForSelector('.continueButton', { timeout: 10000 });
        await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
        await page.click('.continueButton');
        await page.waitForSelector('#confirmButtonTop', { timeout: 10000 });
        await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
        await page.click('#confirmButtonTop');
        await page.waitForSelector('#profileId', { timeout: 10000 });
        await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
        const spanLocator = await page.locator('#profileId');
        const spanText = await spanLocator.textContent();
        console.log('🚀 ~ spanText:', spanText);

        const Request = {
          event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
          resource: { id: spanText },
        };
        const next = await request(app.getHttpServer())
          .post('/business/paypal-proccess?payment=paypal')
          .send(Request);
        const currentSubscriptions = await request(app.getHttpServer()).get(
          `/business/subscriptions/get/${updatePlan.userId}`,
        );
        console.log('🚀 ~ currentSubscriptions:', currentSubscriptions);
      }
    }, 120000);
  });

  it.skip('/business (POST)', async () => {
    // const authResponse = await request(app.getHttpServer())
    //   .get('/auth/login')
    //   .send({ email: 'retouch226@gmail.com', password: '24488Ok!' });
    // let accessToken = authResponse.body.accessToken;

    const jwt = new JwtService();
    const access_token = jwt.signAsync(userId, { secret: '1234' });

    const payment = await request(app.getHttpServer())
      .post('/business/subscribe?payment=paypal')
      .send(updatePlan);
    console.log('🚀 ~ payment:', payment['res'].text.link);
    page = await browser.newPage();
    await page.goto(JSON.parse(payment['res'].text).link);
    await page.waitForSelector('#btnNext', { timeout: 10000 });
    await page.screenshot({ path: 'apps/gate/test/page.jpeg' });
    await page.fill('#email', 'sb-b11iq45370193@personal.example.com');
    await page.click('#btnNext');
    await page.waitForSelector('#btnLogin', { timeout: 10000 });
    await page.screenshot({ path: 'apps/gate/test/page1.jpeg' });
    await page.fill('#password', 'IS|1f)G=');
    await page.click('#btnLogin');
    await page.waitForSelector('.continueButton', { timeout: 10000 });
    await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
    await page.click('.continueButton');
    await page.waitForSelector('#confirmButtonTop', { timeout: 10000 });
    await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
    await page.click('#confirmButtonTop');
    await page.waitForSelector('#profileId', { timeout: 10000 });
    await page.screenshot({ path: 'apps/gate/test/page2.jpeg' });
    const spanLocator = await page.locator('#profileId');
    const spanText = await spanLocator.textContent();
    console.log('🚀 ~ spanText:', spanText);
    const Request = {
      event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
      resource: { id: spanText },
    };
    const today = new Date();
    const nextDay = new Date(today.setDate(today.getDate() + 3)).toISOString();
    console.log('🚀 ~ nextDay:', nextDay);
    const updateDto = {
      resource: {
        id: spanText,
        billing_info: {
          next_billing_time: nextDay,
        },
      },
    };
    const next = await request(app.getHttpServer())
      .post('/business/paypal-proccess?payment=paypal')
      .send(Request);
    console.log('🚀 ~ next:', next);
    const subscriptionUpdatedSse = await request(app.getHttpServer())
      .post('/business/subscriptions/updated?payment=paypal')
      .send(updateDto);
  }, 60000);
});

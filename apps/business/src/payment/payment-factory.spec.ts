import { Test, TestingModule } from '@nestjs/testing';
import { PaymentFactory } from './payment.factory';
import { PayPalService } from './payment-services/paypal.service';
import { StripeService } from './payment-services/stripe.service';
import { PaymentModule } from './payment.module';
import { RequestContext } from 'nestjs-request-context';
import { createMock } from '@golevelup/ts-jest';

const PayPalServiceMock = {
  pay: jest.fn().mockResolvedValueOnce('paypal'),
};

const StripeServiceMock = {
  pay: jest.fn().mockResolvedValueOnce('stripe'),
};

const mockRequest = {
  body: { name: 'Test User', email: 'test@example.com' },
  params: { id: '123' },
  query: { payment: 'paypal' },
  headers: { 'Content-Type': 'application/json' },
  // Mock methods if your controller interacts with them
  json: jest.fn(),
  status: jest.fn().mockReturnThis(), // Allow chaining for .status().json()
};

// jest.mock('nestjs-request-context', () => ({
//   RequestContext: jest.fn().mockReturnValueOnce({
//     currentContext: jest.fn().mockReturnValueOnce({
//       req: jest.fn().mockResolvedValueOnce({
//         body: { name: 'Test User', email: 'test@example.com' },
//         params: { id: '123' },
//         query: { payment: 'paypal' },
//         headers: { 'Content-Type': 'application/json' },
//         // Mock methods if your controller interacts with them
//         json: jest.fn(),
//         status: jest.fn().mockReturnThis(), // Allow chaining for .status().json()
//       }),
//     }),
//   }),
// }));

describe('Payment Factory', () => {
  let paymentFactory: PaymentFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentFactory,

        {
          provide: PayPalService,
          useValue: PayPalServiceMock,
        },
        {
          provide: StripeService,
          useValue: StripeServiceMock,
        },
        {
          provide: RequestContext,
          useValue: {
            currentContext: jest.fn().mockResolvedValue({
              payment: 'paypal',
            }),
          },
        },
      ],
    }).compile();
    paymentFactory = await module.resolve<PaymentFactory>(PaymentFactory);
  });
  it.skip('should return paypal', async () => {
    // const mockRequestContext = await createMock<RequestContext>();
    // await mockRequestContext.req.query.payment.mockReturnValueOnce('paypal');
    const res = paymentFactory.getPaymenttService();
  });
});

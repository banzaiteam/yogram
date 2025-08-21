import { ConfigService } from '@nestjs/config';
import { IPaymentService } from './interfaces/payment-service.interface';
import { PaymentFactory } from './payment.factory';

export const PaymentProvider = {
  provide: IPaymentService,
  inject: [PaymentFactory, ConfigService],
  useFactory: (
    paymentFactory: PaymentFactory,
    configService: ConfigService,
  ) => {
    const client_id = configService.get('PAYPAL_CLIENT_ID');
    const client_secret = configService.get('PAYPAL_SECRET');
    const businessServiceUrl = configService.get('BUSINESS_SERVICE_URL');
    return paymentFactory.getPaymenttService(
      client_id,
      client_secret,
      businessServiceUrl,
    );
  },
  exports: [IPaymentService],
};

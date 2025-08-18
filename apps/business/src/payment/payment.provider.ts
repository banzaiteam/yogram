import { IPaymentService } from './interfaces/payment-service.interface';
import { PaymentFactory } from './payment.factory';

export const PaymentProvider = {
  provide: IPaymentService,
  inject: [PaymentFactory],
  useFactory: (paymentFactory: PaymentFactory) => {
    return paymentFactory.getPaymenttService();
  },
  exports: [IPaymentService],
};

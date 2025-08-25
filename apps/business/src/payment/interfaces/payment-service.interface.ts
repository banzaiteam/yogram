import { PaypalCapturePaymentResponse } from 'apps/libs/Business/dto/response/paypal-capture-payment-response.dto';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';

export abstract class IPaymentService {
  abstract capturePayment(token: string): Promise<PaypalCapturePaymentResponse>;

  abstract pay(
    userId: string,
    paymentType: PaymentType,
    subscriptionType: SubscriptionType,
  ): Promise<any>;
}

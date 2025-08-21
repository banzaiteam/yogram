import { PaypalPaymentDto } from '../../../../../apps/libs/Business/dto/input/paypal-payment.dto';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';

export abstract class IPaymentService {
  abstract paymentSuccess(paypalPaymentDto: PaypalPaymentDto): Promise<string>;

  abstract pay(
    paymentType: PaymentType,
    subscriptionType: SubscriptionType,
  ): Promise<string>;
}

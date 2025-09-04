import { PaymentType } from '../../constants/payment-type.enum';
import { SubscriptionType } from '../../constants/subscription-type.enum';

export class PaypalCapturePaymentResponse {
  status: string;
  subscriptions: Subscriptions;
}

type Subscriptions = {
  userId: string;
  paymentType: PaymentType;
  subscriptionType: SubscriptionType;
};

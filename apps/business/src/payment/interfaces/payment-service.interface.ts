import { PaypalCapturePaymentResponse } from 'apps/libs/Business/dto/response/paypal-capture-payment-response.dto';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';
import EventEmitter from 'node:events';

export abstract class IPaymentService {
  abstract capturePayment(token: string): Promise<PaypalCapturePaymentResponse>;

  abstract pay(
    userId: string,
    paymentType: PaymentType,
    subscriptionType: SubscriptionType,
  ): Promise<any>;

  abstract subscribeToPlan(subscriptionType: SubscriptionType): Promise<any>;

  abstract listPlans();

  abstract listProducts();

  abstract getProduct(id: string);

  abstract getPlan(id: string);

  abstract createProduct(subscriptionType: SubscriptionType): Promise<object>;

  abstract createPlan(
    subscriptionType: SubscriptionType,
    productId: string,
    name: string,
    description: string,
  ): Promise<object>;

  abstract deactivatePlan(id: string);

  abstract getSubscription(id: string): Promise<any>;
}

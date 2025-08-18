import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';
import { Payment } from '../../infrastructure/entity/payment.entity';

export abstract class IPaymentService {
  abstract pay(
    address: string,
    subscriptionType: SubscriptionType,
  ): Promise<Payment>;
}

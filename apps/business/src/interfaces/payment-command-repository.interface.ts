import { EntityManager } from 'typeorm';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { SaveSubscriptionDto } from '../payment/payment-services/paypal/dto/save-subscription.dto';

export abstract class IPaymentCommandRepository<R, S> {
  abstract savePayment(
    updatePlanDto: SubscribeDto,
    entityManager?: EntityManager,
  ): Promise<R>;

  abstract saveSubscription(
    saveSubscriptionDto: SaveSubscriptionDto,
    entityManager?: EntityManager,
  ): Promise<S>;
}

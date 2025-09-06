import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';

export abstract class IPaymentService {
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

  abstract suspendSubscription(id: string): Promise<any>;

  abstract activateSubscription(id: string): Promise<any>;
}

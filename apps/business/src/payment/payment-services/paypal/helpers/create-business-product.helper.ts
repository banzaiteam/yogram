import { SubscriptionType } from 'apps/libs/Business/constants/subscription-type.enum';
import { v4 } from 'uuid';
import { IProduct } from '../interfaces/product.interface';

export const createBusinessProduct = (
  subscriptionType: SubscriptionType,
): IProduct => {
  return {
    id: v4(),
    name: `Business subscription for ${subscriptionType > 1 ? `${subscriptionType} days` : '1 day'}`,
    description: JSON.stringify({
      subscriptionType: subscriptionType,
    }),
    type: 'SERVICE',
  };
};

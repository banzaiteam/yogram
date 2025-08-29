import { SubscriptionType } from '../../../../../../../apps/libs/Business/constants/subscription-type.enum';
import {
  IntervalCount,
  IntervalUnit,
  IPlan,
} from '../interfaces/plan.interface';
import { IProduct } from '../interfaces/product.interface';
import { Currency } from '../../../../../../../apps/libs/Business/constants/currency.enum';

export const createBusinessPlan = (
  name: string,
  subscriptionType: SubscriptionType,
  product: IProduct[],
  price: number,
  description: string,
): IPlan => {
  const intervalCount = findKeyByValue(IntervalUnit, subscriptionType);
  const plan: IPlan = {
    name,
    product_id: product.filter((product) => {
      if (product.description['subscriptionType'] === subscriptionType) {
        return product.id;
      }
    })[0].id,
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: {
          interval_unit: IntervalCount.DAY,
          interval_count: +IntervalUnit[intervalCount],
        },
        sequence: 1,
        tenure_type: 'REGULAR',
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value: price,
            currency_code: Currency.Usd,
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      payment_failure_threshold: 3,
      payment_preferences: { value: 10, currency_code: Currency.Usd },
      setup_fee_failure_action: 'CONTINUE',
    },
    description,
  };
  return plan;
};

const findKeyByValue = (obj: object, value: any) => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

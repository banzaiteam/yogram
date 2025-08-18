import { BadRequestException } from '@nestjs/common';
import { SubscriptionType } from '../../../../apps/libs/Business/constants/subscription-type.enum';

export function getSubscriptionPrice(subscriptionType: SubscriptionType) {
  switch (subscriptionType) {
    case SubscriptionType.OneDay:
      return 10;
    case SubscriptionType.SevenDays:
      return 50;
    case SubscriptionType.Month:
      return 100;
    default:
      throw new BadRequestException('error: invalid subscriptionPrice value');
  }
}

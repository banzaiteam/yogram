import { PartialType, PickType } from '@nestjs/swagger';
import { Subscription } from '../infrastructure/entity/subscription.entity';

export class SubscriptionUpdateDto extends PartialType(
  PickType(Subscription, ['expiresAt', 'startAt']),
) {}

import { Expose, Type } from 'class-transformer';
import { Payment } from '../../../../../apps/business/src/infrastructure/entity/payment.entity';
import { Subscription } from 'apps/business/src/infrastructure/entity/subscription.entity';

export class ResponsePaymentDto extends Payment {
  @Expose()
  expiresAt: Date;
  @Expose()
  @Type(() => Subscription)
  subscription: Subscription;
}

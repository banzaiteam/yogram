import { Expose } from 'class-transformer';
import { Payment } from '../../../../../apps/business/src/infrastructure/entity/payment.entity';

export class ResponsePaymentDto extends Payment {
  @Expose()
  expiresAt: Date;
}

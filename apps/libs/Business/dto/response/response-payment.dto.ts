import { PickType } from '@nestjs/swagger';
import { Payment } from '../../../../../apps/business/src/infrastructure/entity/payment.entity';

export class ResponsePaymentDto extends PickType(Payment, [
  'paymentType',
  'paymentType',
  'price',
  'createdAt',
]) {}

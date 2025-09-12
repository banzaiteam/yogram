import { PaypalEvents } from '../../../../../apps/business/src/payment/payment-services/paypal/constants/paypal-events.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionsSse {
  @ApiProperty({ enum: PaypalEvents, enumName: 'PaypalEvents' })
  event: PaypalEvents;
  userEmail: string;
  subscriptionId: string;
}

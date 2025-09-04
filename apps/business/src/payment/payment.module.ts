import { Module } from '@nestjs/common';
import { PaymentProvider } from './payment.provider';
import { PayPalService } from './payment-services/paypal/paypal.service';
import { StripeService } from './payment-services/stripe/stripe.service';
import { PaymentFactory } from './payment.factory';

@Module({
  providers: [PaymentFactory, PaymentProvider, PayPalService, StripeService],
  exports: [PaymentProvider, PaymentFactory],
})
export class PaymentModule {}

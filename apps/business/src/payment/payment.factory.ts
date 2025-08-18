import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { PayPalService } from './payment-services/paypal.service';
import { StripeService } from './payment-services/stripe.service';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { RequestContext } from 'nestjs-request-context';

@Injectable({ scope: Scope.REQUEST })
export class PaymentFactory {
  constructor(
    private readonly paypalService: PayPalService,
    private readonly stripeService: StripeService,
  ) {}

  getPaymenttService() {
    const service: PaymentType = RequestContext.currentContext.req?.query
      ?.payment as PaymentType;

    switch (service) {
      case PaymentType.PayPal:
        return this.paypalService;
      case PaymentType.Stripe:
        return this.stripeService;
      default:
        throw new BadRequestException('Not correct payment service');
    }
  }
}

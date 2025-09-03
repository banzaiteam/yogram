import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { PayPalService } from './payment-services/paypal/paypal.service';
import { StripeService } from './payment-services/stripe/stripe.service';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { RequestContext } from 'nestjs-request-context';

@Injectable({ scope: Scope.REQUEST })
export class PaymentFactory {
  // private paypalService: PayPalService;
  private readonly stripeService: StripeService;
  constructor() {}

  getPaymenttService(
    clientId: string,
    secret: string,
    businessServiceUrl: string,
  ) {
    if (
      RequestContext.currentContext.req.url.includes(
        '/api/v1/business/payment-sse',
      )
    )
      return;

    const service: PaymentType = RequestContext.currentContext.req?.query
      ?.payment as PaymentType;

    switch (service) {
      case PaymentType.PAYPAL: {
        return new PayPalService(clientId, secret, businessServiceUrl);
      }
      case PaymentType.STRIPE: {
        return this.stripeService;
      }
      default:
        throw new BadRequestException('Not correct payment service');
    }
  }
}

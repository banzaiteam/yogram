import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BusinessQueryService } from '../../business-query.service';
import { PaypalPaymentDto } from '../../../../../apps/libs/Business/dto/input/paypal-payment.dto';

export class PayPalSuccessQuery {
  constructor(public readonly paypalPaymentDto: PaypalPaymentDto) {}
}

@QueryHandler(PayPalSuccessQuery)
export class PayPalSuccessHandler implements IQueryHandler<PayPalSuccessQuery> {
  constructor(private readonly businessQueryService: BusinessQueryService) {}

  async execute({ paypalPaymentDto }: PayPalSuccessQuery): Promise<string> {
    return await this.businessQueryService.paymentSuccess(paypalPaymentDto);
  }
}

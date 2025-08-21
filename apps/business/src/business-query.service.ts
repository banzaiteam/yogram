import { Injectable } from '@nestjs/common';
import { IPaymentService } from './payment/interfaces/payment-service.interface';
import { PaypalPaymentDto } from '../../../apps/libs/Business/dto/input/paypal-payment.dto';

@Injectable()
export class BusinessQueryService {
  constructor(private readonly paymentService: IPaymentService) {}

  async paymentSuccess(paypalPaymentDto: PaypalPaymentDto): Promise<string> {
    return await this.paymentService.paymentSuccess(paypalPaymentDto);
  }
}

import { Injectable } from '@nestjs/common';
import { IPaymentService } from './payment/interfaces/payment-service.interface';

@Injectable()
export class BusinessQueryService {
  constructor(private readonly paymentService: IPaymentService) {}
}

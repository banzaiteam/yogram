import { ValidateNested } from 'class-validator';
import { ResponsePaymentDto } from './response-payment.dto';

export class PaymentsPaginatedResponseDto {
  @ValidateNested()
  items: ResponsePaymentDto[];
  totalItems: number;
  page: number;
  limit: number;
}

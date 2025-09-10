import { ResponsePaymentDto } from './response-payment.dto';

export class PaymentsPaginatedResponseDto {
  items: ResponsePaymentDto[];
  totalItems: number;
  page: number;
  limit: number;
}

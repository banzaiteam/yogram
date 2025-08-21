import { IsString } from 'class-validator';

export class PaypalPaymentDto {
  @IsString()
  PayerID: string;
  @IsString()
  paymentId: string;
}

import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { SubscriptionType } from '../../constants/subscription-type.enum';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../../constants/payment-type.enum';

export class SubscribeDto {
  @ApiHideProperty()
  @IsOptional()
  @IsUUID()
  userId?: string;
  @ApiProperty({ description: 'business subscription days amount' })
  @IsEnum(SubscriptionType)
  subscriptionType: SubscriptionType;
  @ApiHideProperty()
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;
  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  price?: number;
  @IsDate()
  @IsOptional()
  @ApiHideProperty()
  paymentDate?: Date;
}

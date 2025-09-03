import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SubscriptionStatus } from '../constants/subscription-status.enum';
import { Payment } from '../../../../../../../apps/business/src/infrastructure/entity/payment.entity';
import { SubscriptionType } from '../../../../../../../apps/libs/Business/constants/subscription-type.enum';
import { PaymentType } from '../../../../../../../apps/libs/Business/constants/payment-type.enum';

export class SaveSubscriptionDto {
  @IsString()
  subscriptionId: string;
  @IsUUID()
  userId: string;
  @IsUUID()
  @IsOptional()
  paymentId?: string;
  @IsEnum({ enum: SubscriptionStatus })
  status: SubscriptionStatus;
  @IsDate()
  expiresAt?: Date;
  @IsDate()
  startAt?: Date;
  @IsEnum({ enum: SubscriptionType })
  subscriptionType: SubscriptionType;
  @IsEnum({ enum: PaymentType })
  paymentType: PaymentType;
  @IsOptional()
  payment?: Payment[];
}

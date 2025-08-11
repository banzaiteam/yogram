import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.PayPal })
  paymentType: string;
  @Column({ type: 'int' })
  price: number;
  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.OneDay,
  })
  subscriptionType: number;
  @Column({ type: 'date' })
  paymentDate: Date;
  @Column({ type: 'date' })
  expiresAt: Date;
}

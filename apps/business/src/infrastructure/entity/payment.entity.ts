import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';
import {
  Column,
  DeepPartial,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;
  @Column({ type: 'int' })
  price: number;
  @Column({
    type: 'enum',
    enum: SubscriptionType,
    default: SubscriptionType.OneDay,
  })
  subscriptionType: SubscriptionType;
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  subscription: Subscription;

  constructor(entity: DeepPartial<Payment>) {
    Object.assign(this, entity);
  }
}

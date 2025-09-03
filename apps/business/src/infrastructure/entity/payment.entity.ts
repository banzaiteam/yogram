import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { Subscription } from './subscription.entity';
import {
  Column,
  DeepPartial,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;
  @Column({ type: 'int' })
  price: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  subscription: Subscription;

  constructor(entity: DeepPartial<Payment>) {
    Object.assign(this, entity);
  }
}

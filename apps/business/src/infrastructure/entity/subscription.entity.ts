import { Column, DeepPartial, Entity, OneToMany } from 'typeorm';
import { SubscriptionStatus } from '../../payment/payment-services/paypal/constants/subscription-status.enum';
import { Payment } from './payment.entity';
import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({ type: 'uuid' })
  paymentId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'varchar' })
  subscribeId: string;
  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;
  @Column({ type: 'date' })
  expiresAt: Date;
  @Column({ type: 'date' })
  startAt: Date;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  constructor(entity: DeepPartial<Subscription>) {
    super();
    Object.assign(this, entity);
  }
}

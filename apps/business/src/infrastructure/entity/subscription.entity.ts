import { Column, DeepPartial, Entity, OneToMany } from 'typeorm';
import { SubscriptionStatus } from '../../payment/payment-services/paypal/constants/subscription-status.enum';
import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';
import { SubscriptionType } from '../../../../../apps/libs/Business/constants/subscription-type.enum';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { Payment } from './payment.entity';

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({ type: 'varchar' })
  subscriptionId: string;
  @Column({ type: 'uuid', nullable: true })
  paymentId: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;
  @Column({ type: 'enum', nullable: true, enum: SubscriptionType })
  subscriptionType: SubscriptionType;
  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;
  @Column({ type: 'date', nullable: true })
  startAt: Date;
  @Column({ type: 'date', nullable: true })
  expiresAt: Date;

  @OneToMany(() => Payment, (payment) => payment.subscription, {
    nullable: true,
  })
  payments?: Payment[];

  constructor(entity: DeepPartial<Subscription>) {
    super();
    Object.assign(this, entity);
  }
}

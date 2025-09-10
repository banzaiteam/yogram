import { Subscription } from './subscription.entity';
import { Column, DeepPartial, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';

@Entity('payments')
export class Payment extends BaseEntity {
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
    super();
    Object.assign(this, entity);
  }
}

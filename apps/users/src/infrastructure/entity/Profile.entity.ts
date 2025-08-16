import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';
import { Payment } from '../../../../../apps/business/src/infrastructure/entity/payment.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ type: 'varchar', length: '30', unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: true, length: 300 })
  aboutMe: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  constructor(entity: Partial<Profile>) {
    super();
    Object.assign(this, entity);
  }
}

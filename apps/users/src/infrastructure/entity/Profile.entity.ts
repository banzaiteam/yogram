import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';
import { Subscribers } from './Subscribers.entity';

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

  @ManyToMany(() => Subscribers, (subscribers) => subscribers.profiles)
  subscribers: Subscribers[];

  constructor(entity: Partial<Profile>) {
    super();
    Object.assign(this, entity);
  }
}

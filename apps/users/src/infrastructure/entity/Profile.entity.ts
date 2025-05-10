import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from 'apps/libs/common/entity/base.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ type: 'varchar', length: '30' })
  username: string;

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

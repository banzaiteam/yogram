import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from 'apps/libs/common/entity/base.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ type: 'varchar', length: '30' })
  username: string;
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}

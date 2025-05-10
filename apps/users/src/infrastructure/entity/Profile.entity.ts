import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { BaseEntity } from 'apps/libs/common/entity/base.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid', { name: 'profile_id' })
  id: string;
  @Column({ type: 'varchar', length: '30' })
  username: string;

  @OneToOne(() => User, (user) => user.profile, { cascade: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}

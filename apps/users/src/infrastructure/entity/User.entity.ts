import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Profile } from './Profile.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar' })
  password: string;
  @Column({ type: 'boolean' })
  verified: boolean = false;

  constructor(entity: Partial<User>) {
    super();
    Object.assign(this, entity);
  }

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: true,
  })
  profile: Profile;
}

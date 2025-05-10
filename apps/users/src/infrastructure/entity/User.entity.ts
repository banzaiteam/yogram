import { BaseEntity } from 'apps/libs/common/entity/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { Profile } from './Profile.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 30 })
  firstName: string;
  @Column({ type: 'varchar', length: 30 })
  lastName: string;
  @Column({ type: 'date' })
  birthdate: Date;
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar', length: 30 })
  password: string;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column({ type: 'varchar' })
  country: string;
  @Column({ type: 'varchar' })
  city: string;
  @Column({ type: 'boolean' })
  verified: boolean = false;

  constructor(entity: Partial<User>) {
    super();
    Object.assign(this, entity);
  }

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
  })
  profile: Profile;
}
export { Profile };

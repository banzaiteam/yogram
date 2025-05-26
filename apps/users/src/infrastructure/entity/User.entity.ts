import { BaseEntity } from '../../../../../apps/libs/common/entity/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Profile } from './Profile.entity';
import { Provider } from './Provider.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  password: string;
  @Column({ type: 'boolean' })
  verified: boolean = false;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    cascade: true,
  })
  profile: Profile;

  @OneToMany(() => Provider, (provider) => provider.user, {
    eager: true,
    cascade: true,
  })
  providers: Provider[];

  constructor(entity: Partial<User>) {
    super();
    Object.assign(this, entity);
  }
}

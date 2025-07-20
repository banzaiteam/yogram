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
  @Column({ type: 'varchar', nullable: true, default: null })
  url: string;
  @Column({ type: 'varchar', nullable: true, default: null })
  firstName: string;
  @Column({ type: 'varchar', nullable: true, default: null })
  lastName: string;
  @Column({ type: 'varchar', nullable: true })
  country: string;
  @Column({ type: 'varchar', nullable: true })
  city: string;
  @Column({ type: 'date', nullable: true })
  birthdate: Date;

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

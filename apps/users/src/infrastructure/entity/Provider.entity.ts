import { BaseEntity } from 'apps/libs/common/entity/base.entity';
import { OauthProviders } from 'apps/libs/Users/constants/oauth-providers.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User.entity';

@Entity('providers')
export class Provider extends BaseEntity {
  @Column({ type: 'enum', enum: OauthProviders })
  type: OauthProviders;
  @Column({ type: 'varchar', nullable: true })
  providerId: string;
  @Column({ type: 'varchar', nullable: true })
  email: string;
  @Column({ type: 'varchar', nullable: true })
  username: string;
  @ManyToOne(() => User, (user) => user.providers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  constructor(entity: Partial<Provider>) {
    super();
    Object.assign(this, entity);
  }
}

import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Profile } from './Profile.entity';

@Entity()
export class Subscriber {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToMany(() => Profile, (profile) => profile.subscribers, {
    cascade: true,
  })
  @JoinTable({
    name: 'subscribes',
    joinColumn: { name: 'subscriber_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'subscribed_id',
      referencedColumnName: 'id',
    },
  })
  profiles: Profile[];
}

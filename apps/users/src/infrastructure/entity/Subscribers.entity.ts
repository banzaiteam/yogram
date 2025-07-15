import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Profile } from './Profile.entity';

@Entity('subscribers')
export class Subscribers {
  // subscriber_profile_id
  @PrimaryColumn('uuid', { name: 'subscriber_id' })
  id: string;
  @ManyToMany(() => Profile, (profile) => profile.subscribers, {
    cascade: true,
  })
  // subscribed_profile_id
  @JoinTable({
    // joinColumn: { name: 'subscriber_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subscribed_id', referencedColumnName: 'id' },
  })
  profiles: Profile[];
}

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryColumn({ type: 'uuid' })
  subscriberId: string;

  @Column({ type: 'varchar', nullable: true })
  subscriberUrl: string;

  @Column({ type: 'varchar' })
  subscriberUsername: string;

  @PrimaryColumn({ type: 'uuid' })
  subscribedId: string;

  @Column({ type: 'varchar', nullable: true })
  subscribedUrl: string;

  @Column({ type: 'varchar' })
  subscribedUsername: string;

  constructor(entity: Partial<Subscriber>) {
    Object.assign(this, entity);
  }
}

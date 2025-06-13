import { BaseEntity } from '../../../../../../libs/common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { File } from './file.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: '50' })
  userId: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'varchar', length: '500' })
  description: string;

  @OneToMany(() => File, (file) => file.post, {
    eager: true,
    cascade: true,
  })
  files: File[];

  constructor(entity: Partial<Post>) {
    super();
    Object.assign(this, entity);
  }
}

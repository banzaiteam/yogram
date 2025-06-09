import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { BaseEntity } from '../../../../../../libs/common/entity/base.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column({ type: 'varchar', length: '50' })
  fileName: string;

  @Column({ type: 'varchar', length: '200' })
  url: string;

  @Column({ type: 'varchar', nullable: true })
  metatype: string;

  @ManyToOne(() => Post, (post) => post.files, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  constructor(entity: Partial<File>) {
    super();
    Object.assign(this, entity);
  }
}

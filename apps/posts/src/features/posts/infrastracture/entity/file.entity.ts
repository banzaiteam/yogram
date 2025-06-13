import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { BaseEntity } from '../../../../../../libs/common/entity/base.entity';
import { FileStatus } from '../../constants/file.constant';

@Entity('files')
export class File extends BaseEntity {
  @Column({ type: 'varchar', length: '50' })
  fileName: string;

  @Column({ type: 'varchar', length: '200', default: null })
  url: string;

  @Column({ type: 'varchar', nullable: true })
  metatype: string;

  @Column({ type: 'enum', enum: FileStatus, default: FileStatus.Pending })
  status: FileStatus;

  @ManyToOne(() => Post, (post) => post.files, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  constructor(entity: Partial<File>) {
    super();
    Object.assign(this, entity);
  }
}

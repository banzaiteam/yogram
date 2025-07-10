import { BaseEntity } from '../../../../../../libs/common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { File } from './file.entity';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: '50' })
  userId: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'varchar', length: '500', nullable: true })
  description?: string;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comment[];

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

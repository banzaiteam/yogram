import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../../../apps/libs/common/entity/base.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  //   @Column({ type: 'uuid' })
  //   postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 300 })
  text: string;

  @Column({ type: 'integer', default: 0 })
  likes: number;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.childrens, {
    // eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    onDelete: 'CASCADE',
  })
  childrens: Comment[];

  constructor(entity: Partial<Comment>) {
    super();
    Object.assign(this, entity);
  }
}

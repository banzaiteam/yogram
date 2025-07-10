import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../../../apps/libs/common/entity/base.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 300 })
  text: string;

  @Column({ type: 'integer', default: 0 })
  likes: number;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
    onDelete: 'CASCADE',
  })
  childComments: Comment[];
}

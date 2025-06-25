import { BaseDeleteOutBox } from 'apps/libs/common/outbox/base-delete-outbox.entity';
import { Entity } from 'typeorm';

@Entity('posts-delete-outbox')
export class PostsDeleteOubox extends BaseDeleteOutBox {}

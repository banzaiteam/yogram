import { Column } from 'typeorm';
import { BaseEntity } from '../entity/base.entity';

export class BaseDeleteOutBox extends BaseEntity {
  @Column({ type: 'uuid' })
  entityId: string;
  @Column({ type: 'varchar' })
  pathToFiles: string;
  @Column({ type: 'varchar' })
  bucketName: string;
  @Column({ type: 'boolean', default: false })
  entityDeleted: boolean;
  @Column({ type: 'boolean', default: false })
  filesDeleted: boolean;
}

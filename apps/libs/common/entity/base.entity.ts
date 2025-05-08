import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn({ type: 'date' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'date' })
  updateAt: Date;
  @DeleteDateColumn({ type: 'date' })
  deletedAt: Date;
}

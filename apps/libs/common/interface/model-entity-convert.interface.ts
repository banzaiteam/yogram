import { AggregateRoot } from '@nestjs/cqrs';

import { BaseEntity } from '../entity/base.entity';

export interface IModelEntityConvert<
  TModel extends AggregateRoot,
  TEntity extends BaseEntity,
> {
  toModel(entity: TEntity): TModel;
  toEntity(model: TModel): TEntity;
}

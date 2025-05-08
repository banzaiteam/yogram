import { AggregateRoot } from '@nestjs/cqrs';

import { BaseEntity } from '../entity/base.entity';

/**
 * Interface for converting from business model to entity and vice versa
 *
 * @param {AggregateRoot} TModel - Business model type that extends from cqrs(ddd) AggregateRoot class which allows dispatching events within model.
 * @param {BaseEntity} TEntity - Each dataBase entity should extends from BaseEntity
 */
export interface IModelEntityConvert<
  TModel extends AggregateRoot,
  TEntity extends BaseEntity,
> {
  toModel(entity: TEntity): TModel;
  toEntity(model: TModel): TEntity;
}

import { Repository } from 'typeorm';
import { BaseEntity } from '../entity/base.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { IModelEntityConvert } from '../interface/model-entity-convert.interface';
import { RpcException } from '@nestjs/microservices';
import { IQueryRepository } from '../interface/query-repository.interface';

/**
 * Abstract method which implements base query sql crud methods.
 *
 * @param {AggregateRoot} TModel - Business model type that extends from cqrs(ddd) AggregateRoot class which allows dispatching events within model.
 * @param {BaseEntity} TEntity - Each dataBase entity should extends from BaseEntity
 */
export abstract class SqlQueryBaseRepository<
  TModel extends AggregateRoot,
  TEntity extends BaseEntity,
> implements IQueryRepository<TModel, TEntity>
{
  constructor(
    private readonly repository: Repository<TEntity>,
    private readonly modelEntityFactory: IModelEntityConvert<TModel, TEntity>,
  ) {}
}

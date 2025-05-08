import { Repository } from 'typeorm';
import { BaseEntity } from '../entity/base.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { ICommandRepository } from '../interface/command-repository.interface';
import { IModelEntityConvert } from '../interface/model-entity-convert.interface';
import { RpcException } from '@nestjs/microservices';

/**
 * Abstract method which implements base sql crud methods.
 *
 * @param {AggregateRoot} TModel - Business model type that extends from cqrs(ddd) AggregateRoot class which allows dispatching events within model.
 * @param {BaseEntity} TEntity - Each dataBase entity should extends from BaseEntity
 */
export abstract class SqlCommandBaseRepository<
  TModel extends AggregateRoot,
  TEntity extends BaseEntity,
> implements ICommandRepository<TModel, TEntity>
{
  constructor(
    private readonly repository: Repository<TEntity>,
    private readonly modelEntityFactory: IModelEntityConvert<TModel, TEntity>,
  ) {}

  async save(model: TModel): Promise<TModel> {
    const entity = this.modelEntityFactory.toEntity(model);
    const entityInstance = this.repository.create(entity);

    try {
      const createdEntity = await this.repository.save(entityInstance);
      return this.modelEntityFactory.toModel(createdEntity);
    } catch (err) {
      throw new RpcException(err['driverError']);
    }
  }
}

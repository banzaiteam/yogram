import { DataSource, Repository } from 'typeorm';
import { BaseEntity } from '../entity/base.entity';
import { AggregateRoot } from '@nestjs/cqrs';
import { ICommandRepository } from '../interface/command-repository.interface';
import { IModelEntityFactory } from '../interface/model-entity-factory.interface';
import { RpcException } from '@nestjs/microservices';

/**
 * Abstract method which implements base sql crud methods.
 *
 * @param {BaseEntity} TEntity - Each dataBase entity should extends from BaseEntity
 */
export abstract class SqlCommandBaseRepository<TEntity>
  implements ICommandRepository<TEntity>
{
  constructor(private readonly dataSource: DataSource) {}

  async save(data: any[]): Promise<TEntity[]> {
    try {
      return await this.dataSource.manager.save(data);
    } catch (err) {
      throw new RpcException(err['driverError']);
    }
  }
}

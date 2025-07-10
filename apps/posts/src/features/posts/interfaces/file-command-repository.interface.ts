import { DeepPartial, EntityManager } from 'typeorm';

export abstract class IFileCommandRepository<C, U, R> {
  abstract create(
    createFileDto: DeepPartial<C>,
    queryRunner?: EntityManager,
  ): Promise<R>;
}

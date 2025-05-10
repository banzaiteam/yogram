import { DataSource, EntityManager } from 'typeorm';

export abstract class BaseRepository {
  constructor(private readonly dataSource: DataSource) {}

  // We do this so we have the ability to run queries inside transactions.
  private getEntityManager(entityManager?: EntityManager): EntityManager {
    if (entityManager) {
      return entityManager;
    }

    return this.dataSource.manager;
  }

  // Pass entityManager to run queries inside transactions.
  protected getRepository<T extends ObjectLiteral>(
    entityTarget: EntityTarget<T>,
    entityManager?: EntityManager,
  ): Repository<T> {
    const resolvedEntityManager = this.getEntityManager(entityManager);
    return resolvedEntityManager.getRepository(entityTarget);
  }
}

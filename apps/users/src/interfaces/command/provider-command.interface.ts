import { EntityManager } from 'typeorm';
import { ProviderUpdateCriteria } from '../../infrastructure/repository/command/provider-command.repository';

export abstract class IProviderCommandRepository<C, U, R> {
  abstract create(
    createProviderDto: C,
    entityManager?: EntityManager,
  ): Promise<R>;
  abstract update(
    criteria: ProviderUpdateCriteria,
    updateProvidereDto: U,
    entityManager?: EntityManager,
  ): Promise<R>;
  abstract delete(userId: string): Promise<void>;
}

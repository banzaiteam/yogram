import { EntityManager } from 'typeorm';
import { Provider } from '../../infrastructure/entity/Provider.entity';

export abstract class IProviderCommandRepository<C, U> {
  abstract create(
    createProviderDto: C,
    entityManager?: EntityManager,
  ): Promise<Provider>;
  abstract update(updateProvidereDto: U): Promise<Provider>;
  abstract delete(userId: string): Promise<void>;
}

import { EntityManager } from 'typeorm';

export abstract class IProviderQueryRepository<R> {
  abstract findProviderByProviderId(
    providerId: string,
    entityManager?: EntityManager,
  ): Promise<R>;
}

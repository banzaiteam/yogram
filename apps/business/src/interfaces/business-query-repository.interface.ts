import { EntityManager } from 'typeorm';

export abstract class IBusinessQueryRepository<R, S> {
  abstract getSubscription(
    id: string,
    entityManager?: EntityManager,
  ): Promise<S>;

  abstract getUserSubscriptions(id: string): Promise<S[]>;
}

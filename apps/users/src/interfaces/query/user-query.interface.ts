import { EntityManager } from 'typeorm';

export abstract class IUsersQueryRepository<U, R> {
  abstract userLoginQuery(
    email: string,
    entityManager?: EntityManager,
  ): Promise<U>;
}

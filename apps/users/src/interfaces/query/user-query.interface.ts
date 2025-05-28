import { EntityManager } from 'typeorm';
import { UserCriteria } from '../../features/find-by-criteria/query/find-users-by-criteria.query';

export abstract class IUsersQueryRepository<U, R> {
  abstract userLoginQuery(
    email: string,
    entityManager?: EntityManager,
  ): Promise<U>;

  abstract findUserByCriteria(
    criteria: UserCriteria,
    entityManager?: EntityManager,
  ): Promise<R>;

  abstract findUserByUsername(
    username: string,
    entityManager?: EntityManager,
  ): Promise<R>;

  abstract findUserByProviderId(
    providerId: string,
    entityManager?: EntityManager,
  ): Promise<R>;
}

import { UserCriteria } from '../../features/find-by-criteria/query/find-users-by-criteria.query';

export abstract class IUsersQueryRepository<U, R> {
  abstract userLoginQuery(email: string): Promise<U>;

  abstract findUserByCriteria(criteria: UserCriteria): Promise<R>;

  abstract findUserByUsername(username: string): Promise<R>;

  abstract findUserByProviderId(providerId: string): Promise<R>;
}

import { EntityManager } from 'typeorm';
import { UserCriteria } from '../../features/find-by-criteria/query/find-users-by-criteria.query';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';

export abstract class IUsersQueryRepository<U, R> {
  abstract userLoginQuery(
    email: string,
    entityManager?: EntityManager,
  ): Promise<U>;

  abstract findUserByCriteria(
    criteria: UserCriteria,
    entityManager?: EntityManager,
  ): Promise<R>;
}

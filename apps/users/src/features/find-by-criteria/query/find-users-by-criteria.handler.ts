import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByCriteriaQuery } from './find-users-by-criteria.query';
import { UserQueryRepository } from '../../../../../../apps/users/src/infrastructure/repository/query/user-query.repository';
import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';

@QueryHandler(FindUserByCriteriaQuery)
export class FindUserByCriteriaHandler
  implements IQueryHandler<FindUserByCriteriaQuery>
{
  constructor(private readonly userQueryRepository: UserQueryRepository) {}
  async execute({
    criteria,
  }: FindUserByCriteriaQuery): Promise<ResponseUserDto | null> {
    return await this.userQueryRepository.findUserByCriteria(criteria);
  }
}

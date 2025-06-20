import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByCriteriaQuery } from './find-users-by-criteria.query';
import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';
import { UsersQueryService } from 'apps/users/src/users-query.service';

@QueryHandler(FindUserByCriteriaQuery)
export class FindUserByCriteriaHandler
  implements IQueryHandler<FindUserByCriteriaQuery>
{
  constructor(private readonly userQueryService: UsersQueryService) {}

  async execute({
    criteria,
  }: FindUserByCriteriaQuery): Promise<ResponseUserDto | null> {
    return await this.userQueryService.findUserByCriteria(criteria);
  }
}

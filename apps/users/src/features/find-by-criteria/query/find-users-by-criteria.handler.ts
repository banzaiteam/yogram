import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByCriteriaQuery } from './find-users-by-criteria.query';
import { UserQueryRepository } from '../../../../../../apps/users/src/infrastructure/repository/query/user-query.repository';
import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';
import { DataSource } from 'typeorm';

@QueryHandler(FindUserByCriteriaQuery)
export class FindUserByCriteriaHandler
  implements IQueryHandler<FindUserByCriteriaQuery>
{
  constructor(
    private readonly userQueryRepository: UserQueryRepository,
    private dataSource: DataSource,
  ) {}
  async execute({
    criteria,
  }: FindUserByCriteriaQuery): Promise<ResponseUserDto | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    return await this.userQueryRepository.findUserByCriteria(
      criteria,
      queryRunner.manager,
    );
  }
}

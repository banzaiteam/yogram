import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from './find-one-by-id.query';
import { UsersQueryService } from 'apps/users/src/users-query.service';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(private readonly usersQueryService: UsersQueryService) {}
  async execute({ id }: FindUserByIdQuery): Promise<any> {
    return await this.usersQueryService.findUserByIdQuery(id);
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from 'apps/users/src/infrastructure/repository/query/user-query.repository';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { DataSource } from 'typeorm';
import { FindUserByProviderIdQuery } from './find-user-by-providerId.query';
import { UsersQueryService } from 'apps/users/src/users-query.service';

@QueryHandler(FindUserByProviderIdQuery)
export class FindUserByProviderIdHandler
  implements IQueryHandler<FindUserByProviderIdQuery>
{
  constructor(
    private readonly userQueryRepository: UserQueryRepository,
    private dataSource: DataSource,
    private readonly usersQueryService: UsersQueryService,
  ) {}
  async execute(
    command: FindUserByProviderIdQuery,
  ): Promise<ResponseUserDto | null> {
    console.log('🚀 ~ providerId:', command.providerId);
    const queryRunner = this.dataSource.createQueryRunner();
    return await this.userQueryRepository.findUserByProviderId(
      command.providerId,
      queryRunner.manager,
    );
  }
}

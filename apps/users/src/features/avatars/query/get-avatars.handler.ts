import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryService } from '../../../../../../apps/users/src/users-query.service';
import { GetFilesUrlDto } from '../../../../../../apps/libs/Files/dto/get-files.dto';

export class GetAvatarsQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetAvatarsQuery)
export class GetAvatarsHandler implements IQueryHandler<GetAvatarsQuery> {
  constructor(private readonly usersQueryService: UsersQueryService) {}
  async execute({ id }: GetAvatarsQuery): Promise<GetFilesUrlDto[]> {
    return await this.usersQueryService.getAvatars(id);
  }
}

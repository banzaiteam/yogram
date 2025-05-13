import { IdDto } from 'apps/libs/common/dto/id.dto';
import { EntityManager } from 'typeorm';

export abstract class IUsersQueryRepository<R> {
  abstract findUserByIdQuery(
    id: IdDto,
    entityManager?: EntityManager,
  ): Promise<R>;
}

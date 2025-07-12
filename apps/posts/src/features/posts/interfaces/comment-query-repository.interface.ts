import { EntityManager } from 'typeorm';
import { IFiltering } from '../../../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { IPagination } from '../../../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from '../../../../../../apps/libs/common/pagination/decorators/sorting.decorator';

export abstract class ICommentQueryRepository<R, Pagination> {
  abstract get(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<Pagination>;

  abstract findCommentbyId(
    postId: string,
    entityManager?: EntityManager,
  ): Promise<R>;
}

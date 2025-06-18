import { IFiltering } from 'apps/gate/common/pagination/decorators/filtering.decorator';
import { IPagination } from 'apps/gate/common/pagination/decorators/pagination.decorator';
import { ISorting } from 'apps/gate/common/pagination/decorators/sorting.decorator';

export abstract class IPostQueryRepository<R> {
  abstract get(
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
  ): Promise<R>;
}

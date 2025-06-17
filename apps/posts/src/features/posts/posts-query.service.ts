import { Injectable } from '@nestjs/common';
import { IFiltering } from 'apps/gate/common/pagination/decorators/filtering.decorator';
import { IPagination } from 'apps/gate/common/pagination/decorators/pagination.decorator';
import { ISorting } from 'apps/gate/common/pagination/decorators/sorting.decorator';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';

@Injectable()
export class PostsQueryService {
  constructor(private readonly postQueryRepository: PostsQueryRepository) {}

  async get(pagination: IPagination, sorting: ISorting, filtering: IFiltering) {
    return await this.postQueryRepository.get(pagination, sorting, filtering);
  }
}

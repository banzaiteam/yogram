import { Injectable } from '@nestjs/common';
import { IFiltering } from 'apps/libs/common/pagination/decorators/filtering.decorator';
import { IPagination } from 'apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from 'apps/libs/common/pagination/decorators/sorting.decorator';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';
import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';

@Injectable()
export class PostsQueryService {
  constructor(private readonly postQueryRepository: PostsQueryRepository) {}

  async get(
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
  ): Promise<PostPaginatedResponseDto> {
    return await this.postQueryRepository.get(pagination, sorting, filtering);
  }
}

import { IPagination } from 'apps/gate/common/pagination/decorators/pagination.decorator';
import { IPostQueryRepository } from '../../../interfaces/posts-query-repository.interface';
import { Post } from '../../entity/post.entity';
import {
  getSortingOrder,
  ISorting,
} from 'apps/gate/common/pagination/decorators/sorting.decorator';
import {
  getFilteringObject,
  IFiltering,
} from 'apps/gate/common/pagination/decorators/filtering.decorator';
import { IPaginatedResponse } from 'apps/gate/common/pagination/interfaces/Pagination-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PostsQueryRepository
  implements IPostQueryRepository<IPaginatedResponse<Post>>
{
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async get(
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
  ): Promise<IPaginatedResponse<Post>> {
    const sort = getSortingOrder(sorting);
    const filter = getFilteringObject(filtering);
    const data = await this.postRepository.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
      order: sort,
      where: filter,
      relations: {
        files: true,
      },
    });
    console.log('🚀 ~ data:', data);
    return;
  }
}

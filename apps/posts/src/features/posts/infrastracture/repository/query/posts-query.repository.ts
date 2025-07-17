import { IPagination } from '../../../../../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { IPostQueryRepository } from '../../../interfaces/posts-query-repository.interface';
import { Post } from '../../entity/post.entity';
import {
  getSortingOrder,
  ISorting,
} from '../../../../../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import {
  getFilteringObject,
  IFiltering,
} from '../../../../../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PostPaginatedResponseDto } from '../../../../../../../../apps/libs/Posts/dto/output/post-paginated-reponse.dto';

export class PostsQueryRepository
  implements IPostQueryRepository<PostPaginatedResponseDto>
{
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async get(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<PostPaginatedResponseDto> {
    let sort = {},
      filter = {};

    if (sorting) {
      sort = getSortingOrder(sorting);
    }
    if (filtering) {
      filter = getFilteringObject(filtering);
    }
    const data = await this.postRepository.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
      order: sort,
      where: filter,
      relations: {
        files: true,
        comments: true,
      },
    });
    console.log('🚀 ~ data:', data);
    const paginatedResponse: PostPaginatedResponseDto = {
      items: data[0],
      totalItems: data[1],
      page: pagination.page,
      limit: pagination.limit,
    };
    return paginatedResponse;
  }

  async findPostbyId(
    postId: string,
    entityManager?: EntityManager,
  ): Promise<Post> {
    if (entityManager) {
      return await entityManager.findOne(Post, {
        where: { id: postId },
        relations: { files: true, comments: true },
      });
    }

    return await this.postRepository.findOne({
      where: { id: postId },
      relations: { files: true, comments: true },
    });
  }
}

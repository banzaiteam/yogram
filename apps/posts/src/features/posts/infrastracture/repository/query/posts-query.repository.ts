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
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpUsersPath } from 'apps/libs/Users/constants/path.enum';

export class PostsQueryRepository
  implements IPostQueryRepository<PostPaginatedResponseDto>
{
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly configService: ConfigService,
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
    const usersUrl = `${this.configService.get('USERS_SERVICE_URL')}/${HttpUsersPath.FindUserByCriteria}?id=${filtering.value}`;
    let [user, posts] = await Promise.all([
      axios.get(usersUrl),
      this.postRepository.findAndCount({
        skip: pagination.offset,
        take: pagination.limit,
        order: sort,
        where: filter,
        relations: {
          files: true,
          comments: true,
        },
      }),
    ]);
    posts[0] = posts[0].map((post) => {
      post['avatar'] = user.data.url;
      return post;
    });
    const paginatedResponse: PostPaginatedResponseDto = {
      items: posts[0],
      totalItems: posts[1],
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

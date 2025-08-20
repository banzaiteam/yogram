import { Injectable } from '@nestjs/common';
import { IFiltering } from '../../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { IPagination } from '../../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from '../../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';
import { PostPaginatedResponseDto } from '../../../../../apps/libs/Posts/dto/output/post-paginated-reponse.dto';
import { ConfigService } from '@nestjs/config';
import { HttpUsersPath } from '../../../../../apps/libs/Users/constants/path.enum';
import axios from 'axios';

@Injectable()
export class PostsQueryService {
  constructor(
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly configService: ConfigService,
  ) {}

  async get(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<PostPaginatedResponseDto> {
    if (filtering.filterProperty === 'userId') {
      const usersUrl = `${this.configService.get('USERS_SERVICE_URL')}/${HttpUsersPath.FindUserByCriteria}?id=${filtering.value}`;
      const [user, postsPaginated] = await Promise.all([
        axios.get(usersUrl),
        this.postQueryRepository.get(pagination, sorting, filtering),
      ]);

      postsPaginated.items = postsPaginated.items.map((post) => {
        post['avatar'] = user.data.url;
        return post;
      });
      return postsPaginated;
    } else if (filtering.filterProperty === 'id') {
      const postsPaginated = await this.postQueryRepository.get(
        pagination,
        sorting,
        filtering,
      );
      const usersUrl = `${this.configService.get('USERS_SERVICE_URL')}/${HttpUsersPath.FindUserByCriteria}?id=${postsPaginated.items[0].userId}`;
      const user = await axios.get(usersUrl);
      postsPaginated.items = postsPaginated.items.map((post) => {
        post['avatar'] = user.data.url;
        return post;
      });
      return postsPaginated;
    }
  }
}

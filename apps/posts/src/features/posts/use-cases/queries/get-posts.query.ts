import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IFiltering } from 'apps/libs/common/pagination/decorators/filtering.decorator';
import { IPagination } from 'apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from 'apps/libs/common/pagination/decorators/sorting.decorator';
import { PostsQueryService } from '../../posts-query.service';
import { PostPaginatedResponseDto } from 'apps/libs/Posts/dto/output/post-paginated-reponse.dto';

export class GetPostsQuery {
  constructor(
    public readonly pagination: IPagination,
    public readonly sorting?: ISorting,
    public readonly filtering?: IFiltering,
  ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postsQueryService: PostsQueryService) {}

  async execute({
    pagination,
    sorting,
    filtering,
  }: GetPostsQuery): Promise<PostPaginatedResponseDto> {
    return await this.postsQueryService.get(pagination, sorting, filtering);
  }
}

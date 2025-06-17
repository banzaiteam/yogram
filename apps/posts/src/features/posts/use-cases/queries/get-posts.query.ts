import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IFiltering } from 'apps/gate/common/pagination/decorators/filtering.decorator';
import { IPagination } from 'apps/gate/common/pagination/decorators/pagination.decorator';
import { ISorting } from 'apps/gate/common/pagination/decorators/sorting.decorator';
import { Post } from '../../infrastracture/entity/post.entity';
import { PostsQueryService } from '../../posts-query.service';
import { plainToInstance } from 'class-transformer';

export class GetPostsQuery {
  constructor(
    public readonly pagination: IPagination,
    public readonly sorting: ISorting,
    public readonly filtering: IFiltering,
  ) {}
}

@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postsQueryService: PostsQueryService) {}

  async execute({
    pagination,
    sorting,
    filtering,
  }: GetPostsQuery): Promise<Post> {
    const posts = await this.postsQueryService.get(
      pagination,
      sorting,
      filtering,
    );
    return plainToInstance(Post, posts);
  }
}

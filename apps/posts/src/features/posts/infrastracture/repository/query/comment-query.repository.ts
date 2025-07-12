import { InjectRepository } from '@nestjs/typeorm';
import {
  getFilteringObject,
  IFiltering,
} from '../../../../../../../libs/common/pagination/decorators/filtering.decorator';
import { IPagination } from '../../../../../../../libs/common/pagination/decorators/pagination.decorator';
import {
  getSortingOrder,
  ISorting,
} from '../../../../../../../libs/common/pagination/decorators/sorting.decorator';
import { ICommentQueryRepository } from '../../../interfaces/comment-query-repository.interface';
import { Comment } from '../../entity/comment.entity';
import { EntityManager, Repository } from 'typeorm';
import { CommentPaginatedResponseDto } from '../../../../../../../libs/Posts/dto/output/comment-paginated-response.dto';

export class CommentQueryRepository
  implements ICommentQueryRepository<Comment, CommentPaginatedResponseDto>
{
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async get(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<CommentPaginatedResponseDto> {
    let sort = {},
      filter = {};

    if (sorting) {
      sort = getSortingOrder(sorting);
    }
    if (filtering) {
      filter = getFilteringObject(filtering);
    }
    const data = await this.commentRepository.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
      order: sort,
      where: filter,
      // relations: {
      //   childComments: true,
      // },
    });
    const paginatedResponse: CommentPaginatedResponseDto = {
      items: data[0],
      totalItems: data[1],
      page: pagination.page,
      limit: pagination.limit,
    };
    return paginatedResponse;
  }

  async findCommentbyId(
    commentId: string,
    entityManager?: EntityManager,
  ): Promise<Comment> {
    console.log('🚀 ~ commentId:', commentId);
    if (entityManager) {
      return await entityManager.findOneBy(Comment, { id: commentId });
    }
    const allcomments = await this.commentRepository.find({
      where: { id: '357cb41f-9560-4bb1-b823-24c2a04b0367' },
      // relations: { childComments: true },
    });
    console.log('🚀 ~ allcomments:', allcomments);
    const comm = await this.commentRepository.find({
      where: { id: commentId },
    });
    console.log('🚀 ~ comm:', comm);
    return comm[0];
  }
}

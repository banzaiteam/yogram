import { BadRequestException, Injectable } from '@nestjs/common';
import { ICommentCommandRepository } from './interfaces/comment-command-repository.interface';
import { CreateCommentDto } from '../../../../../apps/libs/Posts/dto/input/create-comment.dto';
import { FindCommentCriteria } from '../../../../../apps/libs/Posts/dto/input/find-comment-criteria.dto';
import { UpdateCommentDto } from '../../../../../apps/libs/Posts/dto/input/update-comment.dto';
import { ICommentQueryRepository } from './interfaces/comment-query-repository.interface';
import { CommentPaginatedResponseDto } from 'apps/libs/Posts/dto/output/comment-paginated-response.dto';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';
import { Comment } from './infrastracture/entity/comment.entity';

@Injectable()
export class CommentCommandService {
  constructor(
    private readonly commentCommandRepository: ICommentCommandRepository<
      CreateCommentDto,
      FindCommentCriteria,
      UpdateCommentDto,
      Comment
    >,
    private readonly commentQueryRepository: ICommentQueryRepository<
      Comment,
      CommentPaginatedResponseDto
    >,
    private readonly postQueryRepository: PostsQueryRepository,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    let parentComment;
    const post = await this.postQueryRepository.findPostbyId(
      createCommentDto.postId,
    );
    console.log('🚀 ~ CommentCommandService ~ create ~ post:', post);
    if (!post)
      throw new BadRequestException(
        'CommentCommandService error: post does not exists',
      );
    createCommentDto.post = post;
    if (createCommentDto.parentId) {
      parentComment = await this.commentQueryRepository.findCommentbyId(
        createCommentDto.parentId,
      );
      console.log(
        '🚀 ~ CommentCommandService ~ create ~ parentComment:',
        parentComment,
      );
      if (!parentComment) {
        throw new BadRequestException(
          'CommentCommandService error: parent comment does not exists',
        );
      }
    }
    return await this.commentCommandRepository.create(createCommentDto);
  }
}

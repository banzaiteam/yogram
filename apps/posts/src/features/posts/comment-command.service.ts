import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ICommentCommandRepository } from './interfaces/comment-command-repository.interface';
import { CreateCommentDto } from '../../../../../apps/libs/Posts/dto/input/create-comment.dto';
import { FindCommentCriteria } from '../../../../../apps/libs/Posts/dto/input/find-comment-criteria.dto';
import { UpdateCommentDto } from '../../../../../apps/libs/Posts/dto/input/update-comment.dto';
import { ICommentQueryRepository } from './interfaces/comment-query-repository.interface';
import { CommentPaginatedResponseDto } from 'apps/libs/Posts/dto/output/comment-paginated-response.dto';
import { PostsQueryRepository } from './infrastracture/repository/query/posts-query.repository';
import { Comment } from './infrastracture/entity/comment.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseCommentDto } from '../../../../../apps/libs/Posts/dto/output/response-comment.dto';

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

  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<ResponseCommentDto> {
    const post = await this.postQueryRepository.findPostbyId(
      createCommentDto.postId,
    );
    if (!post)
      throw new BadRequestException(
        'CommentCommandService error: post does not exists',
      );
    createCommentDto.post = post;
    if (createCommentDto.parentId) {
      const parentComment = await this.commentQueryRepository.findCommentbyId(
        createCommentDto.parentId,
      );
      if (!parentComment) {
        throw new BadRequestException(
          'CommentCommandService error: parent comment does not exists',
        );
      }
    }
    return plainToInstance(
      ResponseCommentDto,
      await this.commentCommandRepository.create(createCommentDto),
    );
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<void> {
    const updated = await this.commentCommandRepository.update(
      id,
      updateCommentDto,
    );
    if (updated > 1)
      throw new InternalServerErrorException(
        'CommentCommandService error: commentwas not updated',
      );
  }
}

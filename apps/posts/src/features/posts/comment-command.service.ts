import { Injectable } from '@nestjs/common';
import { ICommentCommandRepository } from './interfaces/comment-command-repository.interface';
import { CreateCommentDto } from 'apps/libs/Posts/dto/input/create-comment.dto';
import { FindCommentCriteria } from 'apps/libs/Posts/dto/input/find-comment-criteria.dto';
import { UpdateCommentDto } from 'apps/libs/Posts/dto/input/update-comment.dto';

@Injectable()
export class CommentCommandService {
  constructor(
    private readonly commentCommandRepository: ICommentCommandRepository<
      CreateCommentDto,
      FindCommentCriteria,
      UpdateCommentDto,
      Comment
    >,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentCommandRepository.create(createCommentDto);
  }
}

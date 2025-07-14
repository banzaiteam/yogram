import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ICommentCommandRepository } from '../../../interfaces/comment-command-repository.interface';

import { CreateCommentDto } from '../../../../../../../../apps/libs/Posts/dto/input/create-comment.dto';
import { FindCommentCriteria } from '../../../../../../../../apps/libs/Posts/dto/input/find-comment-criteria.dto';
import { UpdateCommentDto } from '../../../../../../../../apps/libs/Posts/dto/input/update-comment.dto';
import { Comment } from '../../entity/comment.entity';

@Injectable()
export class CommentCommandRepository
  implements
    ICommentCommandRepository<
      CreateCommentDto,
      FindCommentCriteria,
      UpdateCommentDto,
      Comment
    >
{
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create(
    commentDto: CreateCommentDto,
    entityManager?: EntityManager,
  ): Promise<Comment> {
    // you should use this queryRunner.manager(entityManager) on save operations because without it typeorm transactions does not work
    const comment = new Comment(commentDto);
    if (entityManager) {
      return await entityManager.save(comment);
    }

    return this.commentRepo.save(comment);
  }

  async update(
    id: string,
    updateDto: UpdateCommentDto,
    entityManager?: EntityManager,
  ): Promise<number> {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment)
      throw new NotFoundException(
        'CommentCommandRepository error: comment was not found',
      );
    const updated = await this.commentRepo.update(id, updateDto);
    if (entityManager) {
      return (await entityManager.update(Comment, id, updateDto)).affected;
    }
    return updated.affected;
  }

  async delete(
    commentId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    if (entityManager) {
      return (await entityManager.delete(Comment, commentId)).affected;
    }
    return (await this.commentRepo.delete(commentId)).affected;
  }
}

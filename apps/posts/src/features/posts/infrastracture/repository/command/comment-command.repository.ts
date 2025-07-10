import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ICommentCommandRepository } from '../../../interfaces/comment-command-repository.interface';
import { Comment } from '../../entity/comment.entity';
import { CreateCommentDto } from 'apps/libs/Posts/dto/input/create-comment.dto';
import { FindCommentCriteria } from 'apps/libs/Posts/dto/input/find-comment-criteria.dto';
import { UpdateCommentDto } from 'apps/libs/Posts/dto/input/update-comment.dto';

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
    criteria: FindCommentCriteria,
    updateDto: UpdateCommentDto,
    entityManager?: EntityManager,
  ): Promise<Comment> {
    return;
    // const post = await this.postRepo
    //   .createQueryBuilder('posts')
    //   .innerJoinAndSelect('posts.files', 'files')
    //   .where('posts.id = :id', { id: criteria?.id })
    //   .orWhere('files.id = :fileid', { fileid: criteria?.fileid })
    //   .getOne();
    // if (!post) throw new NotFoundException('post not found');
    // let files = [];
    // if (
    //   Object.keys(updateDto).includes('url') ||
    //   Object.keys(updateDto).includes('status')
    // ) {
    //   files = await Promise.all(
    //     post.files.map(async (file) => {
    //       if (file.id === criteria.fileid) {
    //         file.url = updateDto?.url;
    //         file.status = updateDto?.status;
    //       }
    //       return file;
    //     }),
    //   );
    // }
    // console.log('🚀 ~ comment:', post);
    // const merged = await Promise.resolve(
    //   this.postRepo.merge(post, {
    //     ...updateDto,
    //     ...files,
    //   }),
    // );
    // if transaction then save with entityManager
    // if (entityManager) {
    //   return await entityManager.save(merged);
    // }
    // return await this.postRepo.save(merged);
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

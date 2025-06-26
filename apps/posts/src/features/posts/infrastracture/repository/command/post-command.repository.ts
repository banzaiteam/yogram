import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../../entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePostDto } from '../../../../../../../libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from '../../../interfaces/post-command-repository.interface';
import { UpdatePostDto } from 'apps/libs/Posts/dto/input/update-post.dto';
import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';

@Injectable()
export class PostCommandRepository
  implements IPostCommandRepository<CreatePostDto, UpdatePostDto, Post>
{
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async create(
    postDto: CreatePostDto,
    entityManager?: EntityManager,
  ): Promise<Post> {
    // todo you should use this queryRunner.manager(entityManager) on save operations because without it typeorm transactions does not work
    const post = new Post({
      id: postDto.postId,
      ...postDto,
    });
    if (entityManager) {
      return await entityManager.save(post);
    }

    return this.postRepo.save(post);
  }
  // todo! make different update for post and file
  async update(
    criteria: UpdatePostCriteria,
    updateDto: UpdatePostDto,
    entityManager?: EntityManager,
  ): Promise<Post> {
    const post = await this.postRepo
      .createQueryBuilder('posts')
      .innerJoinAndSelect('posts.files', 'files')
      .where('posts.id = :id', { id: criteria?.id })
      .orWhere('files.id = :fileid', { fileid: criteria?.fileid })
      .getOne();
    if (!post) throw new NotFoundException('post not found');
    let files = [];
    if (
      Object.keys(updateDto).includes('url') ||
      Object.keys(updateDto).includes('status')
    ) {
      files = await Promise.all(
        post.files.map(async (file) => {
          if (file.id === criteria.fileid) {
            file.url = updateDto?.url;
            file.status = updateDto?.status;
          }
          return file;
        }),
      );
    }

    const merged = await Promise.resolve(
      this.postRepo.merge(post, {
        ...updateDto,
        ...files,
      }),
    );

    // if transaction then save with entityManager
    if (entityManager) {
      return await entityManager.save(merged);
    }
    return await this.postRepo.save(merged);
  }

  async delete(postId: string, entityManager?: EntityManager): Promise<number> {
    if (entityManager) {
      return (await entityManager.delete(Post, postId)).affected;
    }
    return (await this.postRepo.delete(postId)).affected;
  }
}

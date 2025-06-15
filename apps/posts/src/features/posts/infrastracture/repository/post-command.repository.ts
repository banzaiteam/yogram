import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { CreatePostDto } from '../../../../../../libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from '../../interfaces/post-command-repository.interface';
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
    if (entityManager) {
      const post = new Post({
        id: postDto.postId,
        userId: postDto.userId,
        description: postDto.description,
        isPublished: false,
        files: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      return await entityManager.save(post);
    }
    const post = new Post(postDto);
    return this.postRepo.save(post);
  }

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
    const files = post.files.map((file) => {
      if (file.id === criteria.fileid || post.id === criteria.id) {
        file.url = updateDto.url;
      }
      return file;
    });
    this.postRepo.merge(post, { ...updateDto, files });
    if (entityManager) {
      return await entityManager.save(post);
    }
    return await this.postRepo.save(post);
  }

  async delete(postId: string, entityManager?: EntityManager): Promise<number> {
    if (entityManager) {
      return (await entityManager.delete(Post, postId)).affected;
    }
    return (await this.postRepo.delete(postId)).affected;
  }
}

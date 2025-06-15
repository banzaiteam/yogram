import { Injectable } from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePostDto } from '../../../../../../libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from '../../interfaces/post-command-repository.interface';

@Injectable()
export class PostCommandRepository
  implements IPostCommandRepository<CreatePostDto, null, Post>
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

  async delete(postId: string, entityManager?: EntityManager): Promise<number> {
    if (entityManager) {
      return (await entityManager.delete(Post, postId)).affected;
    }
    return (await this.postRepo.delete(postId)).affected;
  }
}

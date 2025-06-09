import { Injectable } from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePostDto } from '../../../../../../libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from '../../interfaces/Post.interface';

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
    if (entityManager) {
      const post = new Post(postDto);
      return await entityManager.save(post);
    }
    const post = new Post(postDto);
    return this.postRepo.save(post);
  }
}

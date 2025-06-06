import { Injectable } from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../../../../../../libs/Posts/dto/input/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) { }

  async create(postDto: CreatePostDto): Promise<Post> {
    const post = new Post(postDto);
    return this.postRepo.save(post);
  }
}

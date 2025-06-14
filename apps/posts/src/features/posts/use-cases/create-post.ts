import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post } from '../infrastracture/entity/post.entity';
import { PostCommandService } from '../post-command.service';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { Request } from 'express';
import axios from 'axios';

export class CreatePostCommand {
  constructor(
    public createPostDto: CreatePostDto,
    public files: Express.Multer.File[],
  ) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postCommandService: PostCommandService) {}

  async execute({ createPostDto, files }: CreatePostCommand): Promise<Post> {
    const newPost = await this.postCommandService.create(createPostDto, files);
    return newPost;
  }
}

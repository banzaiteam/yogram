import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../infrastracture/repository/post.repository';

export class CreatePostCommand {
  constructor(
    public description: string,
    public userId: string,
  ) { }
}
@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(private postsRepository: PostRepository) { }

  async execute(command: CreatePostCommand): Promise<string> {
    const newPost = await this.postsRepository.create(command);

    return newPost.id;
  }
}

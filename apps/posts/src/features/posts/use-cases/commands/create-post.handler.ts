import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { PostCommandService } from '../../post-command.service';
import { Post } from '../../infrastracture/entity/post.entity';

export class CreatePostCommand {
  constructor(
    public createPostDto: CreatePostDto,
    public files: Express.Multer.File[],
  ) {}
}
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(private readonly postCommandService: PostCommandService) {}

  async execute({ createPostDto, files }: CreatePostCommand): Promise<Post> {
    const newPost = await this.postCommandService.create(createPostDto, files);
    return newPost;
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { PostCommandService } from '../../post-command.service';
import { ConfigService } from '@nestjs/config';

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
  constructor(
    private readonly postCommandService: PostCommandService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ createPostDto, files }: CreatePostCommand): Promise<void> {
    await this.postCommandService.create(
      createPostDto,
      files,
      this.configService.get('BUCKET'),
    );
  }
}

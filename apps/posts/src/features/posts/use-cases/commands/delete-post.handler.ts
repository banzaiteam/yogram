import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCommandService } from '../../post-command.service';

export class DeletePostCommand {
  constructor(
    public readonly postId: string,
    public readonly folderPath: string,
    public readonly path: string,
    public readonly host: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand>
{
  constructor(private readonly postCommandService: PostCommandService) {}
  async execute({
    postId,
    folderPath,
    host,
    path,
  }: DeletePostCommand): Promise<any> {
    await this.postCommandService.deletePostWithFiles(
      postId,
      folderPath,
      host,
      path,
    );
  }
}

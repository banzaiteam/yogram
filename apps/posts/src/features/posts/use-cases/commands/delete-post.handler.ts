import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCommandService } from '../../post-command.service';
import { ConfigService } from '@nestjs/config';
import { HttpFilesPath } from 'apps/libs/Files/constants/path.enum';

export class DeletePostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand>
{
  constructor(
    private readonly postCommandService: PostCommandService,
    private readonly configService: ConfigService,
  ) {}
  async execute({ userId, postId }: DeletePostCommand): Promise<any> {
    const folderPath = ['posts', userId, postId].join('/');
    const deleteServiceUrl = [
      this.configService.get('FILES_SERVICE_URL'),
      HttpFilesPath.Delete,
    ].join('/');
    console.log('🚀 ~ execute ~ deleteServiceUrl:', deleteServiceUrl);
    await this.postCommandService.deletePostWithFiles(
      postId,
      folderPath,
      deleteServiceUrl,
      this.configService.get('BUCKET'),
    );
  }
}

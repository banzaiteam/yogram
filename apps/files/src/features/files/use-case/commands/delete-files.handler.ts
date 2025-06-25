import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesCommandService } from '../../../../../../../apps/files/src/files-command.service';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';

export class DeleteFilesCommand {
  constructor(public readonly folder: string) {}
}

@CommandHandler(DeleteFilesCommand)
export class DeleteFilesCommandHandler
  implements ICommandHandler<DeleteFilesCommand>
{
  constructor(private readonly filesCommandService: FilesCommandService) {}

  async execute({ folder }: DeleteFilesCommand): Promise<any> {
    return await this.filesCommandService.deleteUploadedFolder(
      AwsBuckets.Files,
      folder,
    );
  }
}

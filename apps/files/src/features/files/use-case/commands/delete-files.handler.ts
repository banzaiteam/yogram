import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesCommandService } from '../../../../../../../apps/files/src/files-command.service';

export class DeleteFilesCommand {
  constructor(
    public readonly folder: string,
    public readonly bucket: string,
  ) {}
}

@CommandHandler(DeleteFilesCommand)
export class DeleteFilesCommandHandler
  implements ICommandHandler<DeleteFilesCommand>
{
  constructor(private readonly filesCommandService: FilesCommandService) {}

  async execute({ folder, bucket }: DeleteFilesCommand): Promise<any> {
    return await this.filesCommandService.deleteUploadedFolder(bucket, folder);
  }
}

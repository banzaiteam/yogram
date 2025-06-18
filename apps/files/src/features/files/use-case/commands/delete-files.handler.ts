import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesCommandService } from '../../../../../../../apps/files/src/files-command.service';
import { DeletePostFilesDto } from '../../../../../../../apps/libs/Files/dto/delete-post-files.dto';

export class DeleteFilesCommand {
  constructor(public readonly deleteFilesDto: DeletePostFilesDto) {}
}

@CommandHandler(DeleteFilesCommand)
export class DeleteFilesCommandHandler
  implements ICommandHandler<DeleteFilesCommand>
{
  constructor(private readonly filesCommandService: FilesCommandService) {}

  async execute({ deleteFilesDto }: DeleteFilesCommand): Promise<any> {
    return await this.filesCommandService.deleteUploadedFolderOrFiles(
      deleteFilesDto,
    );
  }
}

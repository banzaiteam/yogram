import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesCommandService } from 'apps/files/src/files-command.service';
import { ChunkedFileDto } from 'apps/libs/common/chunks-upload/dto/chunked-file.dto';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';

export class UploadFilesCommand {
  constructor(public readonly chunkedFileDto: ChunkedFileDto) {}
}

@CommandHandler(UploadFilesCommand)
export class UploadFilesCommandHandler
  implements ICommandHandler<UploadFilesCommand>
{
  constructor(private readonly filesCommandService: FilesCommandService) {}

  async execute({ chunkedFileDto }: UploadFilesCommand): Promise<any> {
    return await this.filesCommandService.uploadFiles(
      chunkedFileDto,
      AwsBuckets.Files,
    );
  }
}

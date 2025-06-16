import { InternalServerErrorException } from '@nestjs/common';
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
    const response = await this.filesCommandService.uploadFiles(
      chunkedFileDto,
      AwsBuckets.Files,
    );
    const delPath = [
      chunkedFileDto.filesUploadBaseDir,
      response.folderPath,
    ].join('/');
    await this.filesCommandService.deleteLocalFileFromPath(delPath);
    // todo!!! need to remove uploaded files from /apps/files/src/features/files/uploads
    // send uploadFilesResponse via rmq to update post files
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesCommandService } from '../../../../../../../apps/files/src/files-command.service';
import { ChunkedFileDto } from '../../../../../../../apps/libs/common/chunks-upload/dto/chunked-file.dto';
import { ProducerService } from '../../../../../../../apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { AwsBuckets } from '../../../../../../../apps/libs/Files/constants/aws-buckets.constant';

export class UploadFilesCommand {
  constructor(public readonly chunkedFileDto: ChunkedFileDto) {}
}

@CommandHandler(UploadFilesCommand)
export class UploadFilesCommandHandler
  implements ICommandHandler<UploadFilesCommand>
{
  constructor(
    private readonly filesCommandService: FilesCommandService,
    private readonly producerService: ProducerService,
  ) {}

  async execute({ chunkedFileDto }: UploadFilesCommand): Promise<any> {
    const response = await this.filesCommandService.uploadFiles(
      chunkedFileDto,
      AwsBuckets.Files,
    );
    const delPath = [
      chunkedFileDto.filesUploadBaseDir,
      response.folderPath,
    ].join('/');
    // send uploading response to service by rmq
    await this.producerService.emit({
      routingKey: chunkedFileDto.routingKey,
      payload: response,
    });
    // delete files/uploads/...
    await this.filesCommandService.deleteLocalFolderWithFiles(delPath);
  }
}

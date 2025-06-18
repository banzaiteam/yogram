import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ChunksFileUploader } from '../../../../../../apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { ChunkedFileDto } from '../../../../../../apps/libs/common/chunks-upload/dto/chunked-file.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UploadFilesCommand } from '../use-case/commands/upload-files.handler';
import { DeletePostFilesDto } from '../../../../../../apps/libs/Files/dto/delete-post-files.dto';
import { DeleteFilesCommand } from '../use-case/commands/delete-files.handler';
@Controller()
export class FilesController {
  constructor(
    private readonly chunksFileUploader: ChunksFileUploader,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('files/upload')
  async uploadFile(@Body() chunkedFileDto: ChunkedFileDto) {
    await this.chunksFileUploader.proccessComposeFile(chunkedFileDto);
    if (
      chunkedFileDto.metadata.currentChunk ===
      chunkedFileDto.metadata.totalChunks
    ) {
      return new Promise((res, rej) => {
        res(this.commandBus.execute(new UploadFilesCommand(chunkedFileDto)));
        rej(new Error('Files Controller: files was not uploaded'));
      });
    }
  }

  @Delete('files/delete')
  async delete(@Body() deletePostFilesDto: DeletePostFilesDto) {
    return await this.commandBus.execute(
      new DeleteFilesCommand(deletePostFilesDto),
    );
  }
}

import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from '../../../files.service';
import { IUploader } from '../providers/interface/uploader.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getUploadPath } from 'apps/gate/src/posts/helper';
import { Request } from 'express';
import { ChunksFileUploader } from 'apps/libs/common/upload/chunks-file-uploader.service';
import { ChunkedFileDto } from 'apps/libs/common/upload/dto/chunked-file.dto';

@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly uploadService: IUploader,
    private readonly chunksFileUploader: ChunksFileUploader,
  ) {}

  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     storage: diskStorage({
  //       destination: async (req, file, cb) => {
  //         cb(
  //           null,
  //           await getUploadPath(
  //             req.body.userId,
  //             'apps/files/src/features/files/uploads',
  //           ),
  //         );
  //       },
  //       // filename: (req, file, cb) => {
  //       //   cb(null, genFileName(file.originalname));
  //       // },
  //     }),
  //   }),
  // )
  @Post('files/upload')
  async uploadFile(@Body() chunkedFileDto: ChunkedFileDto) {
    console.log(
      '🚀 ~ FilesController ~ uploadFile ~ chunkedFileDto:',
      chunkedFileDto,
    );

    await this.chunksFileUploader.proccessComposeFile(chunkedFileDto);
  }
}

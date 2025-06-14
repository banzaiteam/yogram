import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from './interfaces/Post.interface';
import { Post } from './infrastracture/entity/post.entity';
import { DataSource } from 'typeorm';
import { FileCommandService } from './file-command.service';
import { CreateFileDto } from '../../dto/create-file.dto';
import { ChunksFileUploader } from 'apps/libs/common/upload/chunks-file-uploader.service';
import { HttpFilesPath } from 'apps/libs/Files/constants/path.enum';
import { HttpServices } from 'apps/gate/common/constants/http-services.enum';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs/promises';

@Injectable()
export class PostCommandService {
  constructor(
    private readonly postCommandRepository: IPostCommandRepository<
      CreatePostDto,
      null,
      Post
    >,
    private readonly fileCommandService: FileCommandService,
    private readonly chunksFileUploader: ChunksFileUploader,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // todo you should use this queryRunner.manager on save operations because without it typeorm transactions does not work
      const post = await this.postCommandRepository.create(
        createPostDto,
        queryRunner.manager,
      );
      for (const file of files) {
        const createFileDto: CreateFileDto = {
          fileName: file.fieldname,
          url: null,
          metatype: file.mimetype,
          post,
        };
        // todo you should use this queryRunner.manager on save operations because without it typeorm transactions does not work
        await this.fileCommandService.create(
          createFileDto,
          queryRunner.manager,
        );
      }
      // upload files to files service and delete temporary uploaded photos and chunks to photos service
      this.sendFilesToFilesServiceAndDeleteTempFilesAfter(
        files,
        [createPostDto.userId, createPostDto.postId].join('/'),
        HttpFilesPath.Upload,
        this.configService.get('FILES_SERVICE_URL'),
      );

      await queryRunner.commitTransaction();
      return post;
    } catch (error) {
      console.log('rollback', error);
      await queryRunner.rollbackTransaction();
      await fs.rm(files[0].destination, { recursive: true });
      throw new InternalServerErrorException(
        'PostCommandService: post was not created',
      );
    } finally {
      await queryRunner.release();
    }
  }

  sendFilesToFilesServiceAndDeleteTempFilesAfter(
    files: Express.Multer.File[],
    folderPath: string,
    path: string,
    host: string,
  ) {
    new Promise((res, rej) => {
      res(
        this.chunksFileUploader.proccessChunksUpload(
          files,
          folderPath,
          path,
          host,
        ),
      );
      rej(
        new InternalServerErrorException(
          'PostCommandService: photos was not uploaded',
        ),
      );
    })
      .then(async () => {
        await fs.rm(files[0].destination, { recursive: true });
      })
      .catch(async (err) => {
        await fs.rm(files[0].destination, { recursive: true });
      });
  }

  async proccessFiles() {}
}

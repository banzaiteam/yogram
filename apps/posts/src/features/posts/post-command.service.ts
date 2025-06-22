import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from './interfaces/post-command-repository.interface';
import { Post } from './infrastracture/entity/post.entity';
import { DataSource } from 'typeorm';
import { FileCommandService } from './file-command.service';
import { CreateFileDto } from '../../dto/create-file.dto';
import { ChunksFileUploader } from 'apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { HttpFilesPath } from 'apps/libs/Files/constants/path.enum';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs/promises';
import { EventBus } from '@nestjs/cqrs';
import { DeletePostEvent } from './use-cases/events/delete-post.event';
import { HttpService } from '@nestjs/axios';
import { DeletePostFilesDto } from 'apps/libs/Files/dto/delete-post-files.dto';
import { firstValueFrom } from 'rxjs';
import { v4 } from 'uuid';
import { FileStatus } from './constants/file.constant';
import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';
import { UpdatePostDto } from 'apps/libs/Posts/dto/input/update-post.dto';
import { UploadFile } from 'apps/libs/common/chunks-upload/interfaces/upload-file.interface';
import { FileTypes } from 'apps/libs/Files/constants/file-type.enum';
@Injectable()
export class PostCommandService {
  constructor(
    private readonly postCommandRepository: IPostCommandRepository<
      CreatePostDto,
      UpdatePostDto,
      Post
    >,
    private readonly fileCommandService: FileCommandService,
    private readonly chunksFileUploader: ChunksFileUploader,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}
  // todo!!!!!!!! saga delete db post/files record on files uploading error !!!!!!!!!!!!!!!!!!!!
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
      let uploadFiles: UploadFile[] = [];
      for (let file of files) {
        const id = v4();
        const date = new Date();
        const createFileDto: CreateFileDto = {
          id,
          fileName: file.originalname,
          url: null,
          metatype: file.mimetype,
          createdAt: date,
          updatedAt: date,
          deletedAt: null,
          status: FileStatus.Pending,
          post,
        };
        const uploadFile: UploadFile = {
          fileType: FileTypes.Posts,
          filesUploadBaseDir: 'apps/files/src/features/files/uploads',
          fieldname: file.fieldname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          fileId: id,
          originalname: file.filename,
          destination: file.destination,
        };
        uploadFiles.push(uploadFile);
        // todo you should use this queryRunner.manager on save operations because without it typeorm transactions does not work
        await this.fileCommandService.create(
          createFileDto,
          queryRunner.manager,
        );
      }
      const uploadServiceUrl = [
        this.configService.get('FILES_SERVICE_URL'),
        HttpFilesPath.Upload,
      ].join('/');
      // upload files to files service and delete temporary uploaded photos and chunks to photos service
      this.sendFilesToFilesServiceAndDeleteTempFilesAfter(
        createPostDto.postId,
        uploadFiles,
        [createPostDto.userId, createPostDto.postId].join('/'),
        uploadServiceUrl,
      );

      await queryRunner.commitTransaction();
      return post;
    } catch (err) {
      console.log('rollback', err);
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
    postId: string,
    files: UploadFile[],
    filesServiceUploadFolderWithoutBasePath: string,
    uploadServiceUrl: string,
  ) {
    console.log('🚀 ~ PostCommandService ~ path:', uploadServiceUrl);
    new Promise((res, rej) => {
      res(
        this.chunksFileUploader.proccessChunksUpload(
          files,
          filesServiceUploadFolderWithoutBasePath,
          uploadServiceUrl,
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
        console.log('error in post-command-service.........');
        // todo delete post event
        // it delete db post and related files in aws
        //   await this.eventBus.publish(
        //     new DeletePostEvent(
        //       postId,
        //       filesServiceUploadFolderWithoutBasePath,
        //       path,
        //       host,
        //     ),
        //   );
        //   await fs.rm(files[0].destination, { recursive: true });
        // });
      });
  }

  async update(
    criteria: UpdatePostCriteria,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    return await this.postCommandRepository.update(criteria, updatePostDto);
  }

  async deletePostWithFiles(
    postId: string,
    filesServiceUploadFolderWithoutBasePath: string,
    path: string,
    host: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const postsDelitedAmount = await this.postCommandRepository.delete(
        postId,
        queryRunner.manager,
      );
      if (postsDelitedAmount < 1 && !postsDelitedAmount)
        throw new InternalServerErrorException(
          'PostCommandService: post was not deleted',
        );
      const deletePostFilesDto: DeletePostFilesDto = {
        postId,
        filesServiceUploadFolderWithoutBasePath,
      };
      await firstValueFrom(
        this.httpService.post([host, path].join('/'), deletePostFilesDto),
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('rollback', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deletePostFiles(postId: string) {}
}

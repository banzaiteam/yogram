import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from 'apps/libs/Posts/dto/input/create-post.dto';
import { IPostCommandRepository } from './interfaces/post-command-repository.interface';
import { Post } from './infrastracture/entity/post.entity';
import { DataSource, Repository } from 'typeorm';
import { FileCommandService } from './file-command.service';
import { CreateFileDto } from '../../dto/create-file.dto';
import { ChunksFileUploader } from 'apps/libs/common/chunks-upload/chunks-file-uploader.service';
import { HttpFilesPath } from 'apps/libs/Files/constants/path.enum';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs/promises';
import { EventBus } from '@nestjs/cqrs';
import { DeletePostEvent } from './use-cases/events/delete-post.event';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { v4 } from 'uuid';
import { FileStatus } from './constants/file.constant';
import { UpdatePostCriteria } from 'apps/libs/Posts/dto/input/update-post-criteria.dto';
import { UpdatePostDto } from 'apps/libs/Posts/dto/input/update-post.dto';
import { UploadFile } from 'apps/libs/common/chunks-upload/interfaces/upload-file.interface';
import { FileTypes } from 'apps/libs/Files/constants/file-type.enum';
import { FilesRoutingKeys } from 'apps/files/src/features/files/message-brokers/rabbit/files-routing-keys.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsDeleteOubox } from './outbox/posts-delete-outbox.entity';
import { BaseDeleteOutBox } from 'apps/libs/common/outbox/base-delete-outbox.entity';
import { SsePostsEvents } from '../../constants/sse-events.enum';
import EventEmitter from 'node:events';

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
    @InjectRepository(PostsDeleteOubox)
    private readonly postsDeleteOutboxRepo: Repository<PostsDeleteOubox>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    bucketName: string,
    postEmitter: EventEmitter,
  ): Promise<void> {
    console.log('🚀 ~ PostCommandService ~ bucketName:', bucketName);
    console.log('🚀 ~ PostCommandService ~ createPostDto:', createPostDto);
    console.log('🚀 ~ PostCommandService ~ files:', files);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let uploadFiles: UploadFile[] = [];
    try {
      // todo you should use this queryRunner.manager on save operations because without it typeorm transactions does not work
      const post = await this.postCommandRepository.create(
        createPostDto,
        queryRunner.manager,
      );
      postEmitter.emit(SsePostsEvents.CancelToken, {
        userId: post.userId,
        postId: post.id,
      });
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
          postid: createPostDto.postId,
          post,
        };
        const uploadFile: UploadFile = {
          fileType: FileTypes.Posts,
          // todo? make env variable
          filesUploadBaseDir:
            '/home/node/dist/files/src/features/files/uploads/posts',
          fieldname: file.fieldname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          fileId: id,
          originalname: file.filename,
          destination: file.destination,
          bucketName,
        };
        uploadFiles.push(uploadFile);
        // todo you should use this queryRunner.manager on save operations because without it typeorm transactions does not work
        const files = await this.fileCommandService.create(
          createFileDto,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('rollback');
      await queryRunner.rollbackTransaction();
      // delete local files during error
      await fs.rm(files[0].destination, { recursive: true });
      throw new InternalServerErrorException(
        'PostCommandService error: post was not created because of database error',
      );
    } finally {
      await queryRunner.release();
    }

    console.log(
      'fiels service url ===',
      this.configService.get('FILES_SERVICE_URL'),
    );

    try {
      const uploadServiceUrl = [
        this.configService.get('FILES_SERVICE_URL'),
        HttpFilesPath.Upload,
      ].join('/');

      // upload files one by one to files service and delete temporary uploaded photos and chunks to photos service
      await this.sendFilesToFilesServiceAndDeleteTempFilesAfter(
        createPostDto.userId,
        createPostDto.postId,
        uploadFiles,
        [createPostDto.userId, createPostDto.postId].join('/'),
        uploadServiceUrl,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'PostCommandService error: post was not created because of files upload error',
      );
    }
  }

  async sendFilesToFilesServiceAndDeleteTempFilesAfter(
    userId: string,
    postId: string,
    files: UploadFile[],
    filesServiceUploadFolderWithoutBasePath: string,
    uploadServiceUrl: string,
  ) {
    await new Promise((res, rej) => {
      res(
        this.chunksFileUploader.proccessChunksUpload(
          FilesRoutingKeys.FilesUploadedPosts,
          files,
          filesServiceUploadFolderWithoutBasePath,
          uploadServiceUrl,
        ),
      ),
        rej(new Error());
    })
      .then(async () => {
        await fs.rm(files[0].destination, { recursive: true });
      })
      .catch(async (err) => {
        console.log(err.response?.data?.message);
        // delete post with uploaded files during error
        await this.eventBus.publish(new DeletePostEvent(userId, postId));
        // delete local files during error
        await fs.rm(files[0].destination, { recursive: true });
        throw new Error();
      });
  }

  async update(
    criteria: UpdatePostCriteria,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const saved = await this.postCommandRepository.update(
        criteria,
        updatePostDto,
        queryRunner.manager,
      );
      console.log('🚀 ~ PostCommandService ~ saved:', saved);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      console.log('🚀 ~ PostCommandService rollback:', error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.response, error.response.httpStatusCode);
    } finally {
      await queryRunner.release();
    }
  }

  async deletePostWithFiles(
    postId: string,
    filesServiceUploadFolderWithoutBasePath: string,
    endpoint: string,
    bucketName: string,
  ): Promise<void> {
    // postsDeleteOutBox init
    // let postsDeleteOutBoxModel = this.postsDeleteOutboxRepo.create({
    //   id: postId,
    //   bucketName,
    //   pathToFiles: filesServiceUploadFolderWithoutBasePath,
    // });
    // postsDeleteOutBoxModel = await this.postsDeleteOutboxRepo.save(
    //   postsDeleteOutBoxModel,
    // );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // maybe db post deleted but there is post folder with files in uploadService, so try delete files even post in db does not exists
      await this.postCommandRepository.delete(postId, queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('rollback deletePostWithFiles', err);
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        `PostCommandService: post ${postId} was not deleted or not exists`,
      );
    } finally {
      await queryRunner.release();
      // post entity was deleted successfully
      // postsDeleteOutBoxModel.entityDeleted = true;
      // await this.postsDeleteOutboxRepo.update(
      //   postsDeleteOutBoxModel.id,
      //   postsDeleteOutBoxModel,
      // );
    }
    try {
      const result = await firstValueFrom(
        this.httpService.delete(endpoint, {
          params: {
            folder: filesServiceUploadFolderWithoutBasePath,
            bucket: bucketName,
          },
        }),
      );
      // all files deleted
      if (result.data) {
        // postsDeleteOutBoxModel.filesDeleted = true;
        // await this.postsDeleteOutboxRepo.update(
        //   postsDeleteOutBoxModel.id,
        //   postsDeleteOutBoxModel,
        // );
      }
    } catch (err) {
      if (
        err.response.data.message &&
        err.response.data.message.includes('bucket:')
      ) {
        const bucketName = err.response.data.message.substring(
          err.response.data.message.lastIndexOf('bucket:') + 7,
        );
        console.log('🚀 ~ bucketName:', bucketName);
        // todo!!! make saga pattern delete posts(add to db(filesServiceUploadFolderWithoutBasePath, bucketName, attemp++) and launch every 5 sec). There catch if post was not deleted in aws
      }
    }
  }

  async deletePostFiles(postId: string) {}
}

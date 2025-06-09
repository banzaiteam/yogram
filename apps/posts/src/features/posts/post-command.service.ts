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

@Injectable()
export class PostCommandService {
  constructor(
    private readonly postCommandRepository: IPostCommandRepository<
      CreatePostDto,
      null,
      Post
    >,
    private readonly fileCommandService: FileCommandService,
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
          url: `http//:www.url.com`,
          metatype: file.mimetype,
          post,
        };
        // todo you should use this queryRunner.manager on save operations because without it typeorm transactions does not work
        await this.fileCommandService.create(
          createFileDto,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();
      return post;
    } catch (error) {
      console.log('rollback', error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'PostCommandService: post was not created',
      );
    } finally {
      await queryRunner.release();
    }
  }
}

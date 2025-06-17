import { Injectable } from '@nestjs/common';
import { IFileCommandRepository } from './interfaces/file-command-repository.interface';
import { CreateFileDto } from '../../dto/create-file.dto';
import { File } from './infrastracture/entity/file.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class FileCommandService {
  constructor(
    private readonly fileCommandRepository: IFileCommandRepository<
      CreateFileDto,
      null,
      File
    >,
  ) {}

  async create(
    createFileDto: CreateFileDto,
    entityManager?: EntityManager,
  ): Promise<File> {
    return await this.fileCommandRepository.create(
      createFileDto,
      entityManager,
    );
  }
}

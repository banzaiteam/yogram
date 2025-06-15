import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { File } from '../entity/file.entity';
import { IFileCommandRepository } from '../../interfaces/file-command-repository.interface';
import { CreateFileDto } from 'apps/posts/src/dto/create-file.dto';

@Injectable()
export class FileCommandRepository
  implements IFileCommandRepository<CreateFileDto, null, File>
{
  constructor(
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}

  async create(fileDto: any, entityManager?: EntityManager): Promise<File> {
    // todo you should use this queryRunner.manager(entityManager) on save operations because without it typeorm transactions does not work
    if (entityManager) {
      const file = new File(fileDto);
      return await entityManager.save(file);
    }
    const file = new File(fileDto);
    return await this.fileRepo.save(file);
  }
}

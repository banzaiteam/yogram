import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ResponseProviderDto } from '../../../apps/libs/Users/dto/provider/response-provider.dto';
import { IProviderCommandRepository } from './interfaces/command/provider-command.interface';
import { CreateProviderDto } from '../../../apps/libs/Users/dto/provider/create-provider.dto';
import { UpdateProviderDto } from '../../../apps/libs/Users/dto/provider/update-provider.dto';
import { ProviderUpdateCriteria } from './infrastructure/repository/command/provider-command.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProviderCommandService {
  constructor(
    private readonly providerCommandRepository: IProviderCommandRepository<
      CreateProviderDto,
      UpdateProviderDto,
      ResponseProviderDto
    >,
    private dataSource: DataSource,
  ) {}

  async create(
    createProviderDto: CreateProviderDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProviderDto> {
    console.log('ProviderCommandService create');

    return await this.providerCommandRepository.create(
      createProviderDto,
      entityManager,
    );
  }

  async update(
    criteria: ProviderUpdateCriteria,
    updateProvidereDto: UpdateProviderDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProviderDto> {
    const user = await this.providerCommandRepository.update(
      criteria,
      updateProvidereDto,
      entityManager,
    );
    console.log('🚀 ~ ProviderCommandService ~ user:', user);
    return plainToInstance(ResponseProviderDto, user);
  }
}

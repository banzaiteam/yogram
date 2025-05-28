import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IProviderQueryRepository } from './interfaces/query/provider-query.interface';
import { ResponseProviderDto } from 'apps/libs/Users/dto/provider/response-provider.dto';

@Injectable()
export class ProviderQueryService {
  constructor(
    private readonly providerQueryRepository: IProviderQueryRepository<ResponseProviderDto>,
    private dataSource: DataSource,
  ) {}
  async findProviderByProviderId(
    providerId: string,
  ): Promise<ResponseProviderDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    return await this.providerQueryRepository.findProviderByProviderId(
      providerId,
      queryRunner.manager,
    );
  }
}

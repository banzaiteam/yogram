import { Injectable } from '@nestjs/common';
import { IProviderQueryRepository } from './interfaces/query/provider-query.interface';
import { ResponseProviderDto } from 'apps/libs/Users/dto/provider/response-provider.dto';

@Injectable()
export class ProviderQueryService {
  constructor(
    private readonly providerQueryRepository: IProviderQueryRepository<ResponseProviderDto>,
  ) {}
  async findProviderByProviderId(
    providerId: string,
  ): Promise<ResponseProviderDto> {
    return await this.providerQueryRepository.findProviderByProviderId(
      providerId,
    );
  }
}

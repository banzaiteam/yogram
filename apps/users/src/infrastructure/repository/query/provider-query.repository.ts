import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IProviderQueryRepository } from '../../../../../../apps/users/src/interfaces/query/provider-query.interface';
import { ResponseProviderDto } from '../../../../../../apps/libs/Users/dto/provider/response-provider.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from '../../entity/Provider.entity';

@Injectable()
export class ProviderQueryRepository
  implements IProviderQueryRepository<ResponseProviderDto>
{
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async findProviderByProviderId(
    providerId: string,
  ): Promise<ResponseProviderDto | null> {
    const provider = await this.providerRepository.findOneBy({
      providerId,
    });
    if (!provider) return null;
    return plainToInstance(ResponseProviderDto, provider);
  }
}

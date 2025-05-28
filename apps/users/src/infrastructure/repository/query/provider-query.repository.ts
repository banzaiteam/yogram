import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../libs/common/abstract/base-repository.abstract';
import { EntityManager, Repository } from 'typeorm';
import { IProviderCommandRepository } from 'apps/users/src/interfaces/command/provider-command.interface';
import { CreateProviderDto } from 'apps/libs/Users/dto/provider/create-provider.dto';
import { Provider } from '../../entity/Provider.entity';
import { UpdateProviderDto } from 'apps/libs/Users/dto/provider/update-provider.dto';
import { IProviderQueryRepository } from 'apps/users/src/interfaces/query/provider-query.interface';
import { ResponseProviderDto } from 'apps/libs/Users/dto/provider/response-provider.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProviderQueryRepository
  extends BaseRepository
  implements IProviderQueryRepository<ResponseProviderDto>
{
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async findProviderByProviderId(
    providerId: string,
    entityManager?: EntityManager,
  ): Promise<ResponseProviderDto | null> {
    const provider = await this.providerRepository(entityManager).findOneBy({
      providerId,
    });
    if (!provider) return null;
    return plainToInstance(ResponseProviderDto, provider);
  }

  private providerRepository(
    entityManager?: EntityManager,
  ): Repository<Provider> {
    return this.getRepository(Provider, entityManager);
  }
}

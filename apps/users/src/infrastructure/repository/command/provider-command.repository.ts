import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../libs/common/abstract/base-repository.abstract';
import { EntityManager, Repository } from 'typeorm';
import { IProviderCommandRepository } from 'apps/users/src/interfaces/command/provider-command.interface';
import { CreateProviderDto } from 'apps/libs/Users/dto/provider/create-provider.dto';
import { Provider } from '../../entity/Provider.entity';
import { UpdateProviderDto } from 'apps/libs/Users/dto/provider/update-provider.dto';

@Injectable()
export class ProviderCommandRepository
  extends BaseRepository
  implements IProviderCommandRepository<CreateProviderDto, UpdateProviderDto>
{
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async create(
    createProviderDto: CreateProviderDto,
    entityManager?: EntityManager,
  ): Promise<Provider> {
    const profile = new Provider(createProviderDto);
    return this.providerRepository(entityManager).save(profile);
  }

  update(updateProviderDto: UpdateProviderDto): Promise<Provider> {
    throw new Error('Method not implemented.');
  }
  delete(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private providerRepository(
    entityManager?: EntityManager,
  ): Repository<Provider> {
    return this.getRepository(Provider, entityManager);
  }
}

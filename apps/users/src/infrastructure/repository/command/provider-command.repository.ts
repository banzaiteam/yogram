import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../../../../libs/common/abstract/base-repository.abstract';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { IProviderCommandRepository } from '../../../../../../apps/users/src/interfaces/command/provider-command.interface';
import { CreateProviderDto } from 'apps/libs/Users/dto/provider/create-provider.dto';
import { Provider } from '../../entity/Provider.entity';
import { UpdateProviderDto } from '../../../../../../apps/libs/Users/dto/provider/update-provider.dto';
import { ResponseProviderDto } from '../../../../../../apps/libs/Users/dto/provider/response-provider.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProviderCommandRepository
  extends BaseRepository
  implements
    IProviderCommandRepository<
      CreateProviderDto,
      UpdateProviderDto,
      ResponseProviderDto
    >
{
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async create(
    createProviderDto: CreateProviderDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProviderDto> {
    const provider = new Provider(createProviderDto);
    return plainToInstance(
      ResponseProviderDto,
      this.providerRepository(entityManager).save(provider),
    );
  }

  async update(
    criteria: ProviderUpdateCriteria,
    updateProviderDto: UpdateProviderDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProviderDto | null> {
    const provider = await this.providerRepository(entityManager)
      .createQueryBuilder('providers')
      .innerJoin('providers.user', 'user')
      .where('providers.type = :type', { type: criteria?.type })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.id = :userId', { userId: criteria?.userId })
            .orWhere('providers.providerId = :providerId', {
              providerId: criteria?.providerId,
            })
            .orWhere('user.email = :email', {
              email: criteria?.email,
            });
        }),
      )
      .getOne();
    if (!provider) throw new NotFoundException();
    this.providerRepository(entityManager).merge(provider, {
      ...updateProviderDto,
    });
    await this.providerRepository(entityManager).save(provider);
    return plainToInstance(ResponseProviderDto, provider);
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

export type ProviderUpdateCriteria = {
  userId?: string;
  type?: string;
  providerId?: string;
  email?: string;
};

import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../libs/common/abstract/base-repository.abstract';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { IProviderCommandRepository } from 'apps/users/src/interfaces/command/provider-command.interface';
import { CreateProviderDto } from 'apps/libs/Users/dto/provider/create-provider.dto';
import { Provider } from '../../entity/Provider.entity';
import { UpdateProviderDto } from 'apps/libs/Users/dto/provider/update-provider.dto';
import { ResponseProviderDto } from 'apps/libs/Users/dto/provider/response-provider.dto';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
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
    console.log('🚀 ~ provider:', provider);
    return plainToInstance(
      ResponseProviderDto,
      this.providerRepository(entityManager).save(provider),
    );
  }

  async update(
    criteria: ProviderUpdateCriteria,
    updateProviderDto: UpdateProviderDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProviderDto> {
    console.log('🚀 ~ updateProviderDto:', updateProviderDto);
    console.log('🚀 ~ criteria:', criteria);
    const provider = await this.providerRepository(entityManager)
      .createQueryBuilder('providers')
      .innerJoin('providers.user', 'user')
      .where('providers.type = :type', { type: criteria?.type })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.id = :userId', { userId: criteria?.userId })
            .orWhere('providers.providerId = :providerId', {
              providerId: '1',
            })
            .orWhere('user.email = :email', {
              email: criteria?.email,
            });
        }),
      )
      .getOne();
    console.log('🚀 ~ provider:', provider);
    this.providerRepository(entityManager).merge(provider, {
      ...updateProviderDto,
    });
    await this.providerRepository(entityManager).save(provider);
    // const updated = await this.providerRepository(entityManager).update(
    //   criteria,
    //   updateProviderDto,
    // );
    // console.log('🚀 ~ updated:', updated);
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

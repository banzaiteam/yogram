import { Injectable } from '@nestjs/common';
import { IBusinessQueryRepository } from 'apps/business/src/interfaces/business-query-repository.interface';
import { Payment } from '../../entity/payment.entity';
import { Subscription } from '../../entity/subscription.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BusinessQueryRepository
  implements IBusinessQueryRepository<Payment, Subscription>
{
  constructor(
    @InjectRepository(Payment)
    private readonly paymentQueryRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private readonly subscriptionQueryRepository: Repository<Subscription>,
  ) {}

  async getSubscription(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Subscription> {
    if (entityManager) {
      return await entityManager.findOneBy(Subscription, {
        subscriptionId: id,
      });
    }
    return await this.subscriptionQueryRepository.findOneBy({ id });
  }
}

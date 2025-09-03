import { Injectable, NotFoundException } from '@nestjs/common';
import { IBusinessQueryRepository } from './interfaces/business-query-repository.interface';
import { Payment } from './infrastructure/entity/payment.entity';
import { Subscription } from './infrastructure/entity/subscription.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class BusinessQueryService {
  constructor(
    private readonly businessQueryRepository: IBusinessQueryRepository<
      Payment,
      Subscription
    >,
  ) {}

  async getSubscription(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Subscription> {
    const subscription = await this.businessQueryRepository.getSubscription(
      id,
      entityManager,
    );
    if (!subscription)
      throw new NotFoundException(
        'BusinessQueryService error: subscription not found',
      );
    return subscription;
  }
}

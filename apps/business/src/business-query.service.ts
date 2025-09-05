import { Injectable, NotFoundException } from '@nestjs/common';
import { IBusinessQueryRepository } from './interfaces/business-query-repository.interface';
import { Payment } from './infrastructure/entity/payment.entity';
import { Subscription } from './infrastructure/entity/subscription.entity';
import { EntityManager } from 'typeorm';
import { SubscriptionStatus } from './payment/payment-services/paypal/constants/subscription-status.enum';

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

  async getUserSubscriptions(id: string): Promise<Subscription[]> {
    const subscriptions =
      await this.businessQueryRepository.getUserSubscriptions(id);
    if (!subscriptions.length)
      throw new NotFoundException(
        'BusinessQueryService error: user`s subscriptions not found',
      );
    return subscriptions;
  }

  async getCurrentUserSubscriptions(id: string): Promise<Subscription[]> {
    const subscriptions =
      await this.businessQueryRepository.getUserSubscriptions(id);

    const currentSubscriptions = subscriptions.filter((subscription) => {
      if (
        subscription.expiresAt &&
        new Date(subscription.expiresAt) > new Date() &&
        subscription.status !== SubscriptionStatus.Approval_Pending
      ) {
        return subscription;
      }
    });
    return currentSubscriptions;
  }
}

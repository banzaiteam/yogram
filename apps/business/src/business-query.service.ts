import { PaymentsPaginatedResponseDto } from '../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { SubscriptionStatus } from './payment/payment-services/paypal/constants/subscription-status.enum';
import { IBusinessQueryRepository } from './interfaces/business-query-repository.interface';
import { IPagination } from '../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { IFiltering } from '../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { ISorting } from '../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { IPaymentService } from './payment/interfaces/payment-service.interface';
import { Subscription } from './infrastructure/entity/subscription.entity';
import { Payment } from './infrastructure/entity/payment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class BusinessQueryService {
  constructor(
    private readonly businessQueryRepository: IBusinessQueryRepository<
      Payment,
      Subscription
    >,
    private readonly paymentService: IPaymentService,
  ) {}

  async getPaymentServiceSubscription(id: string) {
    return await this.paymentService.getSubscription(id);
  }

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

  async getUserSubscriptions(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Subscription[]> {
    const subscriptions =
      await this.businessQueryRepository.getUserSubscriptions(
        id,
        entityManager,
      );
    if (!subscriptions.length)
      throw new NotFoundException(
        'BusinessQueryService error: user`s subscriptions not found',
      );
    return subscriptions;
  }

  async getCurrentUserSubscriptions(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Subscription[]> {
    const subscriptions =
      await this.businessQueryRepository.getUserSubscriptions(
        id,
        entityManager,
      );

    const currentSubscriptions = subscriptions.filter((subscription) => {
      if (
        subscription.expiresAt &&
        new Date(subscription.expiresAt) > new Date() &&
        subscription.status !== SubscriptionStatus.Approval_Pending
      ) {
        if (subscription.status === SubscriptionStatus.Active) {
          subscription['nextPayment'] = subscription.expiresAt;
        }
        return subscription;
      }
    });
    return currentSubscriptions;
  }

  async getPayments(
    pagination: IPagination,
    sorting: ISorting,
    filtering: IFiltering,
  ): Promise<PaymentsPaginatedResponseDto> {
    return await this.businessQueryRepository.getPayments(
      pagination,
      sorting,
      filtering,
    );
  }
}

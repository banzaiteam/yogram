import { Injectable } from '@nestjs/common';
import { IBusinessQueryRepository } from '../../../../../../apps/business/src/interfaces/business-query-repository.interface';
import { IPagination } from '../../../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { PaymentsPaginatedResponseDto } from '../../../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { Payment } from '../../entity/payment.entity';
import { Subscription } from '../../entity/subscription.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponsePaymentDto } from '../../../../../../apps/libs/Business/dto/response/response-payment.dto';
import {
  getSortingOrder,
  ISorting,
} from '../../../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import {
  getFilteringObject,
  IFiltering,
} from '../../../../../../apps/libs/common/pagination/decorators/filtering.decorator';
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

  async getUserSubscriptions(
    id: string,
    entityManager?: EntityManager,
  ): Promise<Subscription[]> {
    if (entityManager) {
      return await entityManager.find(Subscription, { where: { userId: id } });
    }
    return await this.subscriptionQueryRepository.find({
      where: { userId: id },
    });
  }

  async getSubscription(id: string): Promise<Subscription> {
    return await this.subscriptionQueryRepository.findOneBy({
      subscriptionId: id,
    });
  }

  async getPayments(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<PaymentsPaginatedResponseDto> {
    let sort = {},
      filter = {};

    if (sorting) {
      sort = getSortingOrder(sorting);
    }
    if (filtering) {
      filter = getFilteringObject(filtering);
    }

    let payments = await this.paymentQueryRepository.findAndCount({
      skip: pagination.offset,
      take: pagination.limit,
      order: sort,
      where: filter,
      relations: {
        subscription: true,
      },
    });

    const paginatedResponse: PaymentsPaginatedResponseDto = {
      items: plainToInstance(
        ResponsePaymentDto,
        payments[0].map((payment) => {
          if (payment.subscription) {
            payment['expiresAt'] = payment.subscription.expiresAt;
            delete payment.subscription;
          }
          return payment;
        }),
      ),
      totalItems: payments[1],
      page: pagination.page,
      limit: pagination.limit,
    };
    return paginatedResponse;
  }
}

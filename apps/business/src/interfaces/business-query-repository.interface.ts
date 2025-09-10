import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { IFiltering } from '../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { IPagination } from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { ISorting } from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { EntityManager } from 'typeorm';

export abstract class IBusinessQueryRepository<R, S> {
  abstract getSubscription(
    id: string,
    entityManager?: EntityManager,
  ): Promise<S>;

  abstract getUserSubscriptions(
    id: string,
    entityManager?: EntityManager,
  ): Promise<S[]>;

  abstract getPayments(
    pagination: IPagination,
    sorting?: ISorting,
    filtering?: IFiltering,
  ): Promise<PaymentsPaginatedResponseDto>;
}

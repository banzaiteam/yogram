import { PaymentsPaginatedResponseDto } from '../../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { IPagination } from '../../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { IFiltering } from '../../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { ISorting } from '../../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { BusinessQueryService } from '../../business-query.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetPaymentsQuery {
  constructor(
    public readonly pagination: IPagination,
    public readonly sorting: ISorting,
    public readonly filtering: IFiltering,
  ) {}
}

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsHandler implements IQueryHandler<GetPaymentsQuery> {
  constructor(private readonly businessQueryService: BusinessQueryService) {}
  async execute({
    pagination,
    sorting,
    filtering,
  }: GetPaymentsQuery): Promise<PaymentsPaginatedResponseDto> {
    return await this.businessQueryService.getPayments(
      pagination,
      sorting,
      filtering,
    );
  }
}

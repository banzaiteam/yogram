import { PaymentsPaginatedResponseDto } from '../../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { NotificationsGateway } from '../../../../../apps/libs/common/notifications/notifications.gateway';
import { IPagination } from '../../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import { IFiltering } from '../../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { ISorting } from '../../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { BusinessQueryService } from '../../business-query.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { v4 } from 'uuid';

export class GetPaymentsQuery {
  constructor(
    public readonly pagination: IPagination,
    public readonly sorting: ISorting,
    public readonly filtering: IFiltering,
  ) {}
}

@QueryHandler(GetPaymentsQuery)
export class GetPaymentsHandler implements IQueryHandler<GetPaymentsQuery> {
  constructor(
    private readonly businessQueryService: BusinessQueryService,
    private readonly notificationGateway: NotificationsGateway,
  ) {}
  async execute({
    pagination,
    sorting,
    filtering,
  }: GetPaymentsQuery): Promise<PaymentsPaginatedResponseDto> {
    const notification = {
      id: v4(),
      subscriptionId: 'I-djsfklsdjfsl',
      message: `Your subscription is activated and expires by ${'17-09-25'}`,
      readAt: null,
      userId: '1',
      expiresAt: 1000,
      createdAt: new Date('2025-09-16').getTime(),
    };

    const key = `notifications:user:${notification.userId}:notification:${notification.id}`;
    console.log('🚀 ~ GetPaymentsHandler ~ execute ~ key:', key);
    await this.notificationGateway.saveNotification(key, notification);
    return await this.businessQueryService.getPayments(
      pagination,
      sorting,
      filtering,
    );
  }
}

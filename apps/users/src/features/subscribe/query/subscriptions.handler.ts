import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseSubscriptionsDto } from '../../../../../../apps/libs/Users/dto/profile/response-subscriptions.dto';
import { SubscriberQueryService } from '../../../../../../apps/users/src/subscriber-query.service';

export class SubscriptionsQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(SubscriptionsQuery)
export class SubscriptionsHandler implements IQueryHandler<SubscriptionsQuery> {
  constructor(
    private readonly subscriberQueryService: SubscriberQueryService,
  ) {}
  async execute({ id }: SubscriptionsQuery): Promise<ResponseSubscriptionsDto> {
    return await this.subscriberQueryService.getAllSubscriptions(id);
  }
}

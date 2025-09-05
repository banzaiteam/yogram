import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BusinessQueryService } from '../../business-query.service';

export class GetCurrentSubscriptionsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetCurrentSubscriptionsQuery)
export class GetCurrentSubscriptionsHandler
  implements IQueryHandler<GetCurrentSubscriptionsQuery>
{
  constructor(private readonly businessQueryService: BusinessQueryService) {}
  async execute({ userId }: GetCurrentSubscriptionsQuery): Promise<any> {
    return await this.businessQueryService.getCurrentUserSubscriptions(userId);
  }
}

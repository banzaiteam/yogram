import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscriberQueryService } from '../../../../../../apps/users/src/subscriber-query.service';
import { ResponseSubscribersDto } from '../../../../../../apps/libs/Users/dto/profile/response-subscribers.dto';

export class SubscribersQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(SubscribersQuery)
export class SubscribersHandler implements IQueryHandler<SubscribersQuery> {
  constructor(
    private readonly subscriberQueryService: SubscriberQueryService,
  ) {}
  async execute({ id }: SubscribersQuery): Promise<ResponseSubscribersDto> {
    return await this.subscriberQueryService.getAllSubscribers(id);
  }
}

import { EntityManager } from 'typeorm';
import { ResponseSubscriptionsDto } from '../../../../libs/Users/dto/profile/response-subscriptions.dto';
import { ResponseSubscribersDto } from 'apps/libs/Users/dto/profile/response-subscribers.dto';

export abstract class ISubscriberQueryRepository {
  abstract getAllSubscriptions(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscriptionsDto>;

  abstract getAllSubscribers(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscribersDto>;
}

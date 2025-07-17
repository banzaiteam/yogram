import { EntityManager } from 'typeorm';
import { ResponseSubscribedOnDto } from '../../../../../apps/libs/Users/dto/profile/response-subscribed-on.dto';

export abstract class ISubscriberQueryRepository {
  abstract getAllSubscriptions(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscribedOnDto>;

  abstract getAllSubscribers(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscribedOnDto>;
}

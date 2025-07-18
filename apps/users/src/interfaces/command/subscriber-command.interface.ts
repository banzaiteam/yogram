import { EntityManager } from 'typeorm';

export abstract class ISubscriberCommandRepository {
  abstract unsubscribe(
    profileId: string,
    subscribeId: string,
    entityManager?: EntityManager,
  ): Promise<number>;

  abstract subscribe(
    subscriberProfileId: string,
    subscriberUrl: string,
    subscriberUserName: string,
    subscribedProfileId: string,
    subscribedUrl: string,
    subscribedUserName: string,
    entityManager?: EntityManager,
  );
}

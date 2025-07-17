import { Injectable } from '@nestjs/common';
import { ISubscriberCommandRepository } from 'apps/users/src/interfaces/command/subscriber-command.interface';
import { EntityManager, Repository } from 'typeorm';
import { Subscriber } from '../../entity/Subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriberCommandRepository
  implements ISubscriberCommandRepository
{
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  unsubscribe(
    profileId: string,
    subscribeId: String,
    entityManager?: EntityManager,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async subscribe(
    subscriberProfileId: string,
    subscriberUrl: string,
    subscriberUserName: string,
    subscribedProfileId: string,
    subscribedUrl: string,
    subscribedUserName: string,
    entityManager?: EntityManager,
  ) {
    const subscription = this.subscriberRepository.create({
      subscriberId: subscriberProfileId,
      subscriberUrl,
      subscriberUsername: subscriberUserName,
      subscribedId: subscribedProfileId,
      subscribedUrl,
      subscribedUsername: subscribedUserName,
    });
    if (entityManager) {
      return await entityManager.save(subscription);
    }
    return await this.subscriberRepository.save(subscription);
  }
}

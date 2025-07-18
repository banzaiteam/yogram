import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async unsubscribe(
    subscriberUserId: string,
    unsubscribeProfileId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    if (entityManager) {
      const deleted = await entityManager.delete(Subscriber, {
        subscriberId: subscriberUserId,
        subscribedId: unsubscribeProfileId,
      });
      return deleted.affected;
    }
    const deleted = await this.subscriberRepository.delete({
      subscriberId: subscriberUserId,
      subscribedId: unsubscribeProfileId,
    });
    return deleted.affected;
  }

  async subscribe(
    subscriberProfileId: string,
    subscriberUrl: string,
    subscriberUserName: string,
    subscribedProfileId: string,
    subscribedUrl: string,
    subscribedUserName: string,
    entityManager?: EntityManager,
  ): Promise<Subscriber> {
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

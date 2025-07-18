import { Injectable } from '@nestjs/common';
import { ResponseSubscriptionsDto } from '../../../../../libs/Users/dto/profile/response-subscriptions.dto';
import { EntityManager, Repository } from 'typeorm';
import { Subscriber } from '../../entity/Subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ISubscriberQueryRepository } from '../../../../../../apps/users/src/interfaces/query/subscriber-query.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SubscriberQueryRepository implements ISubscriberQueryRepository {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberQueryRepository: Repository<Subscriber>,
  ) {}
  async getAllSubscriptions(
    subscriberId: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscriptionsDto> {
    let subscribedOn;
    if (entityManager) {
      subscribedOn = await entityManager.find(Subscriber, {
        where: { subscriberId: subscriberId },
      });
    } else {
      subscribedOn = await this.subscriberQueryRepository.find({
        where: { subscriberId: subscriberId },
      });
    }

    let parsedSubscription = {
      subscriber: {
        id: '',
        url: '',
        username: '',
      },
      subscribed: [],
    };
    subscribedOn.map((item) => {
      parsedSubscription.subscriber = {
        id: item.subscriberId,
        url: item.subscriberUrl,
        username: item.subscriberUsername,
      };
      const subscribed = {
        id: item.subscribedId,
        url: item.subscribedUrl,
        username: item.subscribedUsername,
      };
      parsedSubscription.subscribed.push(subscribed);
    });
    return plainToInstance(ResponseSubscriptionsDto, parsedSubscription);
  }

  getAllSubscribers(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscriptionsDto> {
    throw new Error('Method not implemented.');
  }
}

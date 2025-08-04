import { Injectable } from '@nestjs/common';
import { ResponseSubscriptionsDto } from '../../../../../libs/Users/dto/profile/response-subscriptions.dto';
import { EntityManager, Repository } from 'typeorm';
import { Subscriber } from '../../entity/Subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ISubscriberQueryRepository } from '../../../../../../apps/users/src/interfaces/query/subscriber-query.interface';
import { plainToInstance } from 'class-transformer';
import { ResponseSubscribersDto } from '../../../../../../apps/libs/Users/dto/profile/response-subscribers.dto';

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
    let subscriptions;
    if (entityManager) {
      subscriptions = await entityManager.findAndCount(Subscriber, {
        where: { subscriberId: subscriberId },
      });
    } else {
      subscriptions = await this.subscriberQueryRepository.findAndCount({
        where: { subscriberId: subscriberId },
      });
    }

    let parsedSubscription = {
      subscriber: {
        id: '',
        url: '',
        username: '',
      },
      subscriptions: [],
      amount: 0,
    };

    subscriptions[0].map((item) => {
      parsedSubscription.subscriber = {
        id: item.subscriberId,
        url: item.subscriberUrl,
        username: item.subscriberUsername,
      };
      const subscription = {
        id: item.subscribedId,
        url: item.subscribedUrl,
        username: item.subscribedUsername,
      };
      parsedSubscription.subscriptions.push(subscription);
      parsedSubscription.amount = subscriptions[1];
    });
    return plainToInstance(ResponseSubscriptionsDto, parsedSubscription);
  }

  async getAllSubscribers(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscribersDto> {
    let subscribers;
    if (entityManager) {
      subscribers = await entityManager.findAndCount(Subscriber, {
        where: { subscribedId: id },
      });
    } else {
      subscribers = await this.subscriberQueryRepository.findAndCount({
        where: { subscribedId: id },
      });
    }
    let parsedSubscribers = {
      user: {
        id: '',
        url: '',
        username: '',
      },
      subscribers: [],
      amount: 0,
    };
    subscribers[0].map((item) => {
      parsedSubscribers.user = {
        id: item.subscribedId,
        url: item.subscribedUrl,
        username: item.subscribedUsername,
      };
      const subscriber = {
        id: item.subscriberId,
        url: item.subscriberUrl,
        username: item.subscriberUsername,
      };
      parsedSubscribers.subscribers.push(subscriber);
      parsedSubscribers.amount = subscribers[1];
    });
    return plainToInstance(ResponseSubscribersDto, parsedSubscribers);
  }
}

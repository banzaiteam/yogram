import { Injectable } from '@nestjs/common';
import { ISubscriberQueryRepository } from './interfaces/query/subscriber-query.interface';
import { EntityManager } from 'typeorm';

@Injectable()
export class SubscriberQueryService {
  constructor(
    private readonly subscriberQueryRepository: ISubscriberQueryRepository,
  ) {}

  async getAllSubscribedOn(
    subscriberId: string,
    entityManager?: EntityManager,
  ): Promise<any> {
    return await this.subscriberQueryRepository.getAllSubscriptions(
      subscriberId,
    );
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ISubscriberQueryRepository } from './interfaces/query/subscriber-query.interface';
import { EntityManager } from 'typeorm';
import { ResponseSubscriptionsDto } from '../../../apps/libs/Users/dto/profile/response-subscriptions.dto';

import { UsersQueryService } from './users-query.service';

@Injectable()
export class SubscriberQueryService {
  constructor(
    private readonly subscriberQueryRepository: ISubscriberQueryRepository,
    private readonly usersQueryService: UsersQueryService,
  ) {}

  async getAllSubscriptions(
    subscriberId: string,
    entityManager?: EntityManager,
  ): Promise<ResponseSubscriptionsDto> {
    const user = await this.usersQueryService.findUserByCriteria({
      id: subscriberId,
    });
    if (!user)
      throw new NotFoundException(
        'SubscriberQueryService error: user was not found',
      );
    if (entityManager) {
      return await this.subscriberQueryRepository.getAllSubscriptions(
        user.profile.id,
        entityManager,
      );
    }
    return await this.subscriberQueryRepository.getAllSubscriptions(
      user.profile.id,
    );
  }
}

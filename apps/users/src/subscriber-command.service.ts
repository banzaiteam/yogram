import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ISubscriberCommandRepository } from './interfaces/command/subscriber-command.interface';
import { UsersQueryService } from './users-query.service';
import { ProfileCommandRepository } from './infrastructure/repository/command/profile-command.repository';
import { SubscriberQueryService } from './subscriber-query.service';

@Injectable()
export class SubscriberCommandService {
  constructor(
    private readonly subscriberCommandRepository: ISubscriberCommandRepository,
    private readonly profileCommandRepository: ProfileCommandRepository,
    private readonly usersQueryService: UsersQueryService,
    // private readonly subscriberQueryService: SubscriberQueryService,
  ) {}

  async subscribe(
    subscriberUserId: string,
    subscribedProfileId: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    const userSubscriber = await this.usersQueryService.findUserByCriteria({
      id: subscriberUserId,
    });

    if (!userSubscriber)
      throw new NotFoundException(
        'ProfileCommandService error: subscriber  user was not found',
      );

    const profileToSubscribeOn =
      await this.profileCommandRepository.findOne(subscribedProfileId);
    if (!profileToSubscribeOn)
      throw new NotFoundException(
        'ProfileCommandService error: profile to subscribe on was not found',
      );

    if (userSubscriber.profile.id === profileToSubscribeOn.id) {
      throw new ConflictException(
        'SubscriberCommandService error: user cant subscribe on himself',
      );
    }

    if (entityManager) {
      return await this.subscriberCommandRepository.subscribe(
        userSubscriber.profile.id,
        userSubscriber.url,
        userSubscriber.profile.username,
        profileToSubscribeOn.id,
        profileToSubscribeOn.user.url,
        profileToSubscribeOn.username,
        entityManager,
      );
    }
    return await this.subscriberCommandRepository.subscribe(
      userSubscriber.profile.id,
      userSubscriber.url,
      userSubscriber.profile.username,
      profileToSubscribeOn.id,
      profileToSubscribeOn.user.url,
      profileToSubscribeOn.username,
    );
  }

  async unsubscribe(
    subscriberUserId: string,
    unsubscribeProfileId: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    const userSubscriber = await this.usersQueryService.findUserByCriteria({
      id: subscriberUserId,
    });

    if (!userSubscriber)
      throw new NotFoundException(
        'ProfileCommandService error: subscriber  user was not found',
      );

    const profileToUnsubscribe =
      await this.profileCommandRepository.findOne(unsubscribeProfileId);
    if (!profileToUnsubscribe)
      throw new NotFoundException(
        'ProfileCommandService error: profile to subscribe on was not found',
      );

    if (entityManager) {
      return await this.subscriberCommandRepository.unsubscribe(
        userSubscriber.profile.id,
        unsubscribeProfileId,
      );
    }
    return await this.subscriberCommandRepository.unsubscribe(
      userSubscriber.profile.id,
      unsubscribeProfileId,
    );
  }
}

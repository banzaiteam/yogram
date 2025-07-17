import { Injectable, NotFoundException } from '@nestjs/common';
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
    profileId: string,
    subscribeId: String,
    entityManager?: EntityManager,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

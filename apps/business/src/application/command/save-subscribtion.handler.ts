import { INotification } from '../../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { NotificationsGateway } from '../../../../../apps/libs/common/notifications/notifications.gateway';
import { NotificationRedisKeys } from '../../payment/redis/notfication-redis-keys.enum';
import { Subscription } from '../../infrastructure/entity/subscription.entity';
import { BusinessCommandService } from '../../business-command.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 } from 'uuid';

export class SaveSubscriptionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(SaveSubscriptionCommand)
export class SaveSubscriptionHandler
  implements ICommandHandler<SaveSubscriptionCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
    private readonly notificationGateway: NotificationsGateway,
  ) {}

  async execute({ id }: SaveSubscriptionCommand): Promise<Subscription> {
    const subscription = await this.businessCommandService.saveSubscription(id);
    console.log(
      '🚀 ~ SaveSubscriptionHandler ~ execute ~ subscription:',
      subscription,
    );
    const notification: INotification = {
      id: v4(),
      subscriptionId: subscription.subscriptionId,
      message: `Your subscription is activated and expires by ${subscription.expiresAt}`,
      readAt: null,
      userId: subscription.userId,
      expiresAt: subscription.expiresAt,
      createdAt: subscription.createdAt,
    };

    const key = `user:${subscription.userId}:notification:${notification.id}`;
    await this.notificationGateway.saveNotification(key, notification);
    return subscription;
  }
}

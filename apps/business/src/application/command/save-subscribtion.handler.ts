import { INotification } from '../../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { NotificationsGateway } from '../../../../../apps/libs/common/notifications/notifications.gateway';
import { Subscription } from '../../infrastructure/entity/subscription.entity';
import { getNotificationKey } from '../../helper/get-notification-key.helper';
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
      expiresAt: new Date(subscription.expiresAt).getTime(),
      createdAt: new Date(subscription.createdAt).getTime(),
    };

    const key = getNotificationKey(subscription, notification);
    await this.notificationGateway.saveNotification(key, notification);
    await this.notificationGateway.send(notification, 30000);
    return subscription;
  }
}

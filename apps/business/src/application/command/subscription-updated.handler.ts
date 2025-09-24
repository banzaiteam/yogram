import { INotification } from '../../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { NotificationsGateway } from '../../../../../apps/libs/common/notifications/notifications.gateway';
import { getNotificationKey } from '../../helper/get-notification-key.helper';
import { BusinessCommandService } from '../../business-command.service';
import { WebsocketEvents } from '../../constants/websocket.event.enum';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 } from 'uuid';

export class SubscriptionUpdatedCommand {
  constructor(public readonly subscriptionId: string) {}
}

@CommandHandler(SubscriptionUpdatedCommand)
export class SubscriptionUpdatedHandler
  implements ICommandHandler<SubscriptionUpdatedCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
    private readonly notificationGateway: NotificationsGateway,
  ) {}
  async execute({ subscriptionId }: SubscriptionUpdatedCommand): Promise<any> {
    const subscription = await this.businessCommandService.updateSubscription(
      subscriptionId,
      {},
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
    await this.notificationGateway.saveNotification(
      key,
      notification,
      2629746000,
    );
    await this.notificationGateway.send(
      notification,
      WebsocketEvents.SubscriptionActive,
      30000,
    );
    return subscription;
  }
}

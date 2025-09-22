import { INotification } from '../../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { NotificationsGateway } from '../../../../../apps/libs/common/notifications/notifications.gateway';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetUserNotificationsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserNotificationsQuery)
export class GetUserNotificationsHandler
  implements IQueryHandler<GetUserNotificationsQuery>
{
  constructor(private readonly notificationGateway: NotificationsGateway) {}

  async execute({
    userId,
  }: GetUserNotificationsQuery): Promise<INotification[]> {
    return await this.notificationGateway.getUserNotifications(userId);
  }
}

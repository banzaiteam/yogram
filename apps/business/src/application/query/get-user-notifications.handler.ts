import { INotification } from '../../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotificationsService } from '../../notifications.service';

export class GetUserNotificationsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserNotificationsQuery)
export class GetUserNotificationsHandler
  implements IQueryHandler<GetUserNotificationsQuery>
{
  constructor(private readonly notificationsService: NotificationsService) {}

  async execute({
    userId,
  }: GetUserNotificationsQuery): Promise<INotification[]> {
    return await this.notificationsService.getUserNotifications(userId);
  }
}

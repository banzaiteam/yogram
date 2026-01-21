import { NotificationsGateway } from '../../../apps/libs/common/notifications/notifications.gateway';
import { createObjectFromArrayReduce } from './helper/create-array-from-object.helper';
import { ExpiresInDuration } from './constants/expires-in-duration.enum';
import { WebsocketEvents } from './constants/websocket.event.enum';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('NOTIFICATION_SCHEDULER')
export class NotificationConsumer extends WorkerHost {
  constructor(private readonly notificationGateway: NotificationsGateway) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const values = Object.values(ExpiresInDuration);
    let notificationsArray = (
      await Promise.all(
        values.map(async (item, index) => {
          if (index < Object.values(ExpiresInDuration).length / 2) {
            const result =
              await this.notificationGateway.getExpiresInNotifications(
                ExpiresInDuration[item],
              );
            return result;
          }
        }),
      )
    ).filter((item) => item !== undefined);

    await Promise.all(
      notificationsArray.map(async (item) => {
        const notificationsObjectsAray = createObjectFromArrayReduce(item);
        delete notificationsObjectsAray.differ;
        notificationsObjectsAray.shift();
        notificationsObjectsAray.map(async (item) => {
          console.log('🚀 ~ NotificationConsumer ~ process ~ item:', item);
          await this.notificationGateway.send(
            item,
            WebsocketEvents.DaysToExpires,
            0,
          );
        });
      }),
    );
    return {};
  }
}

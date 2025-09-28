import { NotificationsGateway } from '../../../apps/libs/common/notifications/notifications.gateway';
import { ExpiresInDuration } from './constants/expires-in-duration.enum';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { NOTIFICATION_SCHEDULER } from './business.module';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsProducer implements OnApplicationBootstrap {
  constructor(
    @InjectQueue(NOTIFICATION_SCHEDULER) private notificationsQueue: Queue,
    private readonly notificationGateway: NotificationsGateway,
  ) {}

  async onApplicationBootstrap() {
    await this.sendNotificationToQueue();
  }

  async sendNotificationToQueue() {
    let notificationsArray = [];
    // for await (const duration of Object.keys(ExpiresInDuration)) {
    //   console.log(
    //     '🚀 ~ NotificationsProducer ~ sendNotificationToQueue ~ duration:',
    //     duration,
    //   );
    //   const notifications =
    //     await this.notificationGateway.getExpiresInNotifications(
    //       ExpiresInDuration[duration],
    //     );
    //   notificationsArray.push(notifications);
    // }
    // console.log('sendNotificationToQueue');
    const result = Promise.resolve(
      Object.values(ExpiresInDuration).map(async (item, index) => {
        if (index < Object.values(ExpiresInDuration).length / 2) {
          const notifications =
            await this.notificationGateway.getExpiresInNotifications(
              ExpiresInDuration[item],
            );
          notificationsArray.push(notifications);
        }
      }),
    );
    await result;
    await this.notificationsQueue.upsertJobScheduler(
      'one-time-per-day',
      { every: 86400000 },
      { name: 'NOTIFICATION_SCHEDULER', data: notificationsArray },
    );
  }
}

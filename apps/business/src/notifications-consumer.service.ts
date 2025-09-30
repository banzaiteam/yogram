import { NotificationsGateway } from '../../../apps/libs/common/notifications/notifications.gateway';
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
            // console.log(
            //   '🚀 ~ NotificationConsumer ~ process ~ result:',
            //   result[1],
            // );
            return result;
          }
        }),
      )
    ).filter((item) => item !== undefined);
    // console.log(
    //   '🚀 ~ NotificationConsumer ~ process ~ notificationsArray:',
    //   notificationsArray,
    // );

    await Promise.all(
      notificationsArray.map(async (item) => {
        console.log('🚀 ~ NotificationConsumer ~ process ~ item:', item);
        const obj = this.createObjectFromArrayReduce(item[1]);
        delete obj.differ;
        await this.notificationGateway.send(
          obj,
          WebsocketEvents.DaysToExpires,
          0,
        );
      }),
    );

    return {};
  }

  createObjectFromArrayReduce(arr) {
    // todo! use for(let i =1; i< arr.length;i++){ arr[1].reduce }
    return arr.reduce((acc, current, index, array) => {
      if (index % 2 === 0 && index + 1 < array.length) {
        acc[current] = array[index + 1];
      } else if (index % 2 === 0 && index + 1 >= array.length) {
        // Handle the case of an odd number of elements
        acc[current] = undefined; // Or some other default value
      }
      return acc;
    }, {});
  }
}

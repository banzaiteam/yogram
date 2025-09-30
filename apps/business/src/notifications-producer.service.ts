import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsProducer implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('NOTIFICATION_SCHEDULER') private notificationsQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    await this.sendNotificationToQueue();
  }

  async sendNotificationToQueue() {
    await this.notificationsQueue.add(
      'NOTIFICATION_SCHEDULER',
      {},
      { repeat: { every: 10000 }, removeOnComplete: true, removeOnFail: true },
    );
  }
}

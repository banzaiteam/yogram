import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsProducer implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('NOTIFICATION_SCHEDULER') private notificationsQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    console.log('NotificationsProducer starts');
  }

  async onApplicationBootstrap() {
    console.log('TIME_PERIOD', this.configService.get('TIME_PERIOD'));

    await this.sendNotificationToQueue();
  }

  async sendNotificationToQueue() {
    console.log('sendNotificationToQueue...');

    await this.notificationsQueue.add(
      'NOTIFICATION_SCHEDULER',
      {},
      {
        repeat: { every: this.configService.get('TIME_PERIOD') },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsProducer implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('NOTIFICATION_SCHEDULER') private notificationsQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.sendNotificationToQueue();
  }

  async sendNotificationToQueue() {
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

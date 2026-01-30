import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsGateway } from 'apps/libs/common/notifications/notifications.gateway';

@Injectable()
export class NotificationsProducer implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('NOTIFICATION_SCHEDULER') private notificationsQueue: Queue,
    private readonly configService: ConfigService,
    private readonly notificationGateway: NotificationsGateway,
  ) {
    console.log('NotificationsProducer starts');
  }

  async onApplicationBootstrap() {
    console.log('TIME_PERIOD', this.configService.get('TIME_PERIOD'));

    await this.sendNotificationToQueue();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendNotificationToQueue() {
    console.log('sendNotificationToQueue...');

    await this.notificationsQueue.add(
      'NOTIFICATION_SCHEDULER',
      {},
      {
        // repeat: { every: this.configService.get('TIME_PERIOD') },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    console.log('after');
  }
}

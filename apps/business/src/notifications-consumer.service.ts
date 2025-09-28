import { BusinessCommandService } from './business-command.service';
import { NOTIFICATION_SCHEDULER } from './business.module';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('NOTIFICATION_SCHEDULER')
export class NotificationConsumer extends WorkerHost {
  constructor() {
    super();
    console.log('NotificationConsumer');
  }

  async process(job: Job, token?: string): Promise<any> {
    console.log('JOB', job);
    return;
  }
}

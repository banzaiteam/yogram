import { Injectable } from '@nestjs/common';
import { EventSubscribe } from 'apps/libs/common/message-brokers/rabbit/decorators/event-subscriber.decorator';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!GATE';
  }
}

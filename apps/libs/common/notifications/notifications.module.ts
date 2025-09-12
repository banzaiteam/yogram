import { DynamicModule, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

@Module({})
export class NotificationsModule {
  static register(): DynamicModule {
    return {
      module: NotificationsModule,
      imports: [],
      providers: [NotificationsService, NotificationsGateway],
    };
  }
}

import { NotificationRedisKeys } from '../../../../../apps/business/src/payment/redis/notfication-redis-keys.enum';
import { INotification } from './notification.interface';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

export interface INotificationsService
  extends OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect {
  send(notification: INotification, delay: number): Promise<void>;
  saveNotification(key: string, notification: INotification): Promise<number>;
}

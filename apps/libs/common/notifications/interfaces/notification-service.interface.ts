import { WebsocketEvents } from '../../../../../apps/business/src/constants/websocket.event.enum';
import { INotification } from './notification.interface';
import { Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ExpiresInDuration } from 'apps/business/src/constants/expires-in-duration.enum';

export interface INotificationsService
  extends OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect {
  send(
    notification: INotification,
    event: WebsocketEvents,
    delay: number,
  ): Promise<void>;
  saveNotification(
    key: string,
    notification: INotification,
    ttl?: number,
  ): Promise<number>;
  getUserNotifications(userId: string): Promise<INotification[]>;
  updateNotification(notificationId: string): Promise<void>;
  getExpiresInNotifications(expiresIn: ExpiresInDuration);
}

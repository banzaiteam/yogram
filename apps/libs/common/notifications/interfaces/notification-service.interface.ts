import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { INotification } from './notification.interface';
import { Socket } from 'socket.io';

export interface INotificationsService
  extends OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect {
  send(notification: INotification, delay: number): Promise<void>;
}

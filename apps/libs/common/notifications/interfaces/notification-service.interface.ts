import { INotification } from './notification.interface';
import { Socket } from 'socket.io';

export interface INotificationService {
  send(notification: INotification, delay: number): Promise<void>;
  handlerConnection(socket: Socket): void;
}

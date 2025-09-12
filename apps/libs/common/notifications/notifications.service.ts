import { INotificationService } from './interfaces/notification-service.interface';
import { INotification } from './interfaces/notification.interface';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class NotificationsService implements INotificationService {
  private connectedClients: Map<string, Socket> = new Map();

  handlerConnection(socket: Socket): void {
    this.connectedClients.set(socket.id, socket);
    socket.on('disconnect', () => {
      this.connectedClients.delete(socket.id);
    });
  }

  async send(notification: INotification, delay: number): Promise<void> {
    return;
  }
}

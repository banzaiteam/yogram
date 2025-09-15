import { NotificationRedisKeys } from '../../../../apps/business/src/payment/redis/notfication-redis-keys.enum';
import { INotificationsService } from './interfaces/notification-service.interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { INotification } from './interfaces/notification.interface';
import { NotificationsService } from './notifications.service';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway implements INotificationsService {
  private connectedClients: Map<string, Socket> = new Map();
  @WebSocketServer()
  private server: Server;
  constructor(private readonly notificationsService: NotificationsService) {}

  afterInit(server: any) {
    this.notificationsService.afterInit(server);
  }
  handleDisconnect(socket: Socket) {
    this.notificationsService.handleDisconnect(socket);
  }

  handleConnection(socket: Socket) {
    this.notificationsService.handleConnection(socket);
  }

  async saveNotification(key: string, notification: INotification) {
    return await this.notificationsService.saveNotification(key, notification);
  }

  async send(notification: INotification, delay: number): Promise<void> {
    return await this.notificationsService.send(notification, delay);
  }
}

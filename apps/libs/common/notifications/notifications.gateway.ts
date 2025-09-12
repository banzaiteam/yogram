import { INotificationsService } from './interfaces/notification-service.interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { INotification } from './interfaces/notification.interface';
import { socketAuthMiddleware } from './helper/socket-auth.helper';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway {
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

  async send(notification: INotification, delay: number): Promise<void> {
    return;
  }
}

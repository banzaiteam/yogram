import { INotificationsService } from './interfaces/notification-service.interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { INotification } from './interfaces/notification.interface';
import { socketAuthMiddleware } from './helper/socket-auth.helper';
import { NotificationsService } from './notifications.service';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class NotificationsGateway implements INotificationsService {
  private connectedClients: Map<string, Socket> = new Map();
  @WebSocketServer()
  private server: Server;
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: any) {
    const authMiddleware = socketAuthMiddleware(this.jwtService);
    server.use(authMiddleware);
  }
  handleDisconnect(socket: Socket) {
    this.notificationsService.handleDisconnect(socket);
  }

  handleConnection(socket: Socket) {
    this.notificationsService.handleConnection(socket);
    this.notificationsService.createIndex();
  }

  async saveNotification(key: string, notification: INotification) {
    return await this.notificationsService.saveNotification(key, notification);
  }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    return await this.notificationsService.getUserNotifications(userId);
  }

  async send(notification: INotification, delay: number): Promise<void> {
    return await this.notificationsService.send(notification, delay);
  }

  async createIndex() {
    return await this.notificationsService.createIndex();
  }

  async getUserNotifications2(userId: string) {
    return await this.notificationsService.getExpiresInNotifications(86400000);
  }
}

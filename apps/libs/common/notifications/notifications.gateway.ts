import { NotificationResponseDto } from '../../../../apps/libs/Business/dto/response/response-notification.dto';
import { ExpiresInDuration } from '../../../../apps/business/src/constants/expires-in-duration.enum';
import { WebsocketEvents } from '../../../../apps/business/src/constants/websocket.event.enum';
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
  }

  async saveNotification(
    key: string,
    notification: INotification,
    ttl?: number,
  ) {
    return await this.notificationsService.saveNotification(
      key,
      notification,
      ttl,
    );
  }

  async getUserNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    return await this.notificationsService.getUserNotifications(userId);
  }

  async send(
    notification: INotification,
    event: WebsocketEvents,
    delay: number,
  ): Promise<void> {
    return await this.notificationsService.send(notification, event, delay);
  }

  async createIndex() {
    return await this.notificationsService.createIndex();
  }

  async getExpiresInNotifications(expiresIn: ExpiresInDuration) {
    return await this.notificationsService.getExpiresInNotifications(expiresIn);
  }

  async updateNotification(notificationId: string) {
    return await this.notificationsService.updateNotification(notificationId);
  }
}

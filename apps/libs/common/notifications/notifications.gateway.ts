import { NotificationResponseDto } from '../../../../apps/libs/Business/dto/response/response-notification.dto';
import { ExpiresInDuration } from '../../../../apps/business/src/constants/expires-in-duration.enum';
import { WebsocketEvents } from '../../../../apps/business/src/constants/websocket.event.enum';
import { INotificationsService } from './interfaces/notification-service.interface';
import { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { INotification } from './interfaces/notification.interface';

import { NotificationsService } from './notifications.service';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { io, Socket as Socket1 } from 'socket.io-client';

@Injectable()
export class NotificationsGateway
  implements
    INotificationsService,
    OnModuleInit,
    OnGatewayConnection,
    OnGatewayInit
{
  private connectedClients: Map<string, Socket> = new Map();
  private socket: Socket1;
  constructor(
    private readonly notificationsService: NotificationsService,
    // private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const jwtService = new JwtService({ global: true });
    const token = await jwtService.signAsync(
      { id: 'd25a77e9-1e92-469f-8e01-c325e8220cc9' },
      { secret: 'secret_jwt_1234' },
    );
    // console.log('🚀 ~ NotificationsGateway ~ onModuleInit ~ token:', token);
    this.socket = io('http://localhost:3007/notifications', {
      auth: { authorization: token },
    });
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket Gateway!');
    });
    this.socket.on('message_from_gateway', (data: any) => {
      console.log('Received from gateway:', data);
    });
    this.socket.on('connectedSocket', (data: any) => {
      console.log('connectedSocket', data);
    });
    this.socket.emit('send_to_gateway', 'hello');
  }

  sendMessageToGateway(message: string) {
    this.socket.emit('send_to_gateway', message); // Emit events to the gateway
  }

  afterInit(server: any) {
    // const authMiddleware = socketAuthMiddleware(this.jwtService);
    // server.use(authMiddleware);
  }
  // handleDisconnect(socket: Socket) {
  //   this.notificationsService.handleDisconnect(socket);
  // }

  handleConnection(socket: Socket) {
    // this.notificationsService.handleConnection(socket);
    this.sendMessageToGateway(`connected ${socket.id}`);
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

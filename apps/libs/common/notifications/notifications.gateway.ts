import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationResponseDto } from '../../../../apps/libs/Business/dto/response/response-notification.dto';
import { ExpiresInDuration } from '../../../../apps/business/src/constants/expires-in-duration.enum';
import { WebsocketEvents } from '../../../../apps/business/src/constants/websocket.event.enum';
import { INotificationsService } from './interfaces/notification-service.interface';
import { INotification } from './interfaces/notification.interface';
import { NotificationsService } from './notifications.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class NotificationsGateway
  implements
    INotificationsService,
    OnModuleInit,
    OnGatewayConnection,
    OnGatewayInit
{
  private connectedClients: Map<string, Socket> = new Map();
  private socket: Socket;
  @WebSocketServer()
  server: Server; // The Socket.IO server instance
  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): void {
    console.log(
      `Received message from client ${client.id} on 'message' channel: ${data}`,
    );

    client.emit('messageReceived', `Server received your message: ${data}`);
  }

  async onModuleInit() {
    console.log('websocket');
  }

  afterInit(server: Server) {
    console.log('sfterInit', server.sockets);
  }

  handleConnection(socket: Socket) {}

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

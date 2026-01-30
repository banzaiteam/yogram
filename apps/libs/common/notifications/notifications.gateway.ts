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
import { OnModuleInit } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { socketAuthMiddleware } from './helper/socket-auth.helper';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(0, { namespace: 'event/notification' })
export class NotificationsGateway
  implements
    INotificationsService,
    OnModuleInit,
    OnGatewayConnection,
    OnGatewayInit
{
  private connectedSockets: string[] = [];

  @WebSocketServer()
  server: Server; // The Socket.IO server instance
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {
    console.log('WebSocketServer');
  }

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
    const authMiddleware = socketAuthMiddleware(this.jwtService);
    server.use(authMiddleware);
  }

  handleConnection(socket: Socket) {
    console.log(`${socket.id} connected`);
    //todo* make auth -> connectedSockets.push({socket.id, userId}) -> send to notifications -> add there to array
    this.connectedSockets.push(socket.id);
    this.notificationsService.addClient(socket);
    this.server.emit('connectedSocket', {
      userId: socket.data.user,
      socketId: socket.id,
    });
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

import { INotificationsService } from './interfaces/notification-service.interface';
import { INotification } from './interfaces/notification.interface';
import { socketAuthMiddleware } from './helper/socket-auth.helper';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class NotificationsService implements INotificationsService {
  private connectedClients: Map<string, Socket> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: any) {
    const authMiddleware = socketAuthMiddleware(this.jwtService);
    server.use(authMiddleware);
  }

  handleDisconnect(socket: Socket) {
    this.connectedClients.delete(socket.id);

    socket.on('disconnect', (err) => {
      console.log('disconected err', err);
    });
  }

  handleConnection(socket: Socket) {
    console.log('socket id', socket.data.user);
    this.connectedClients.set(socket.id, socket);
  }

  async send(notification: INotification, delay: number): Promise<void> {
    return;
  }
}

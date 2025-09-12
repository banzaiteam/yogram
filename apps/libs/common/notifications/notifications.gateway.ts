import { NotificationsService } from './notifications.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  private server: Socket;
  constructor(private readonly notificationsService: NotificationsService) {}
}

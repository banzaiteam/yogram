import { socketAuthMiddleware } from '../../../../apps/libs/common/notifications/helper/socket-auth.helper';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(3007, { namespace: 'notifications' })
export class NotificationsGateway implements OnModuleInit, OnGatewayConnection {
  @WebSocketServer() server: Server;
  private connectedSockets: string[] = [];
  constructor(private readonly jwtService: JwtService) {}

  handleConnection(socket: Socket) {
    console.log(`${socket.id} connected`);
    //todo* make auth -> connectedSockets.push({socket.id, userId}) -> send to notifications -> add there to array
    this.connectedSockets.push(socket.id);
    this.server.emit('connectedSocket', {
      userId: socket.data.user,
      socketId: socket.id,
    });
  }

  afterInit(server: Server) {
    const authMiddleware = socketAuthMiddleware(this.jwtService);
    server.use(authMiddleware);
  }

  onModuleInit() {
    this.server.on('message_from_gateway', (data: any) => {
      console.log('Received from gateway:', data);
    });
  }

  @SubscribeMessage('send_to_gateway')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('message', data);
    client.emit('message_from_gateway', 'Hello from Gateway!');
  }
}

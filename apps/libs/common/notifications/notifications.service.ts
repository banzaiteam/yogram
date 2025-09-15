import { NotificationRedisKeys } from '../../../../apps/business/src/payment/redis/notfication-redis-keys.enum';
import { INotificationsService } from './interfaces/notification-service.interface';
import { INotification } from './interfaces/notification.interface';
import { socketAuthMiddleware } from './helper/socket-auth.helper';
import { REDIS_CLIENT } from '../redis/redis-client.factory';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import Redis from 'ioredis';
import { v4 } from 'uuid';

@Injectable()
export class NotificationsService implements INotificationsService {
  private connectedClients: Map<string, Socket> = new Map();
  private MONTH = 2629746000;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

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

  //HSET
  async saveNotification(
    key: string,
    notification: INotification,
  ): Promise<number> {
    const result = await this.redisClient.hset(key, notification);
    await this.redisClient.expire(key, this.MONTH);
    return result;
  }

  async getUserNotifications(userId: string) {
    let notificationsArray = [];
    const stream = this.redisClient.scanStream({
      match: `user:${userId}:notification:*`,
    });
    const promise = new Promise((res, rej) => {
      stream.on('data', async (keys) => {
        for (let i = 0; i < keys.length; i++) {
          const notification = await this.redisClient.hgetall(keys[i]);
          notificationsArray.push(notification);
        }
      });
      stream.on('end', () => {
        res(notificationsArray);
      });
    });
    await promise;
    return notificationsArray.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async handleConnection(socket: Socket) {
    this.connectedClients.set(socket.data.user, socket);
  }

  async send(notification: INotification, delay: number): Promise<void> {
    return;
  }
}

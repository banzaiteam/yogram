import { INotificationsService } from './interfaces/notification-service.interface';
import { INotification } from './interfaces/notification.interface';
import { REDIS_CLIENT } from '../redis/redis-client.factory';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import Redis from 'ioredis';
import { WsException } from '@nestjs/websockets';
import { ExpiresInDuration } from 'apps/business/src/constants/expires-in-duration.enum';

@Injectable()
export class NotificationsService implements INotificationsService {
  private connectedClients: Map<string, Socket> = new Map();
  private MONTH = 2629746000;

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  afterInit(server: any) {
    this.redisClient.call('');
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

  async getUserNotifications(userId: string): Promise<INotification[]> {
    let notificationsArray = [];
    const stream = this.redisClient.scanStream({
      match: `notifications:user:${userId}:notification:*`,
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
    const socket = this.connectedClients.get(notification.userId);
    if (socket) {
      setTimeout(() => {
        socket.emit('subscription.active', notification.message);
      }, delay);
    }
  }

  async createIndex() {
    try {
      console.log(await this.redisClient.call('FT._LIST'));
      //   await this.redisClient.call('FT.DROPINDEX', 'notifications:Idx');

      //   await this.redisClient.call(
      //     'FT.CREATE',
      //     'notifications:Idx',
      //     'ON',
      //     'HASH',
      //     'PREFIX',
      //     '1',
      //     'notifications:',
      //     'SCHEMA',
      //     'subscriptionId',
      //     'TAG',
      //     'userId',
      //     'TAG',
      //     'expiresAt',
      //     'NUMERIC',
      //     //   'SORTABLE',
      //   );
      console.log('Index created successfully.');
    } catch (err) {
      console.error('Error creating index:', err.message);
      throw new WsException(err);
    }
  }
  // todo return expiresAt - now === 7
  // todo when renew subscription(update) create new notification with the same subscriptionId
  async getExpiresInNotifications(expiresInDuration: ExpiresInDuration) {
    try {
      const todayTimestamp = new Date().getTime();
      const results = await this.redisClient.call(
        'FT.AGGREGATE',
        'notifications:Idx',
        '*',
        'LOAD',
        '2',
        '@expiresAt',
        '@message',
        'APPLY',
        `(@expiresAt - ${todayTimestamp})`,
        'AS',
        'differ', // Search query
        'FILTER',
        expiresInDuration === ExpiresInDuration.Day
          ? `@differ < ${expiresInDuration}`
          : expiresInDuration === ExpiresInDuration.Week
            ? `@differ < ${expiresInDuration}`
            : expiresInDuration === ExpiresInDuration.Month
              ? `@differ < ${expiresInDuration}`
              : null,
      );
      console.log('Search results:', results);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  }
}

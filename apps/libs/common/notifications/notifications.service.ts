import { NotificationResponseDto } from '../../../../apps/libs/Business/dto/response/response-notification.dto';
import { ExpiresInDuration } from '../../../../apps/business/src/constants/expires-in-duration.enum';
import { WebsocketEvents } from '../../../../apps/business/src/constants/websocket.event.enum';
import { EnvironmentMode } from '../../../../apps/business/src/settings/configuration';
import { INotificationsService } from './interfaces/notification-service.interface';
import { INotification } from './interfaces/notification.interface';
import { REDIS_CLIENT } from '../redis/redis-client.factory';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import Redis from 'ioredis';

@Injectable()
export class NotificationsService implements INotificationsService {
  private connectedClients: Map<string, Socket> = new Map();

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
    ttl?: number,
  ): Promise<number> {
    const result = await this.redisClient.hset(key, notification);
    ttl ? await this.redisClient.expire(key, ttl) : null;
    return result;
  }

  async getUserNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    let notificationsArray = [];
    const match = `${
      process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
      process.env.NODE_ENV !== EnvironmentMode.TESTING
        ? ''
        : 'dev:'
    }notifications:user:${userId}:notification:*`;
    const stream = this.redisClient.scanStream({
      match: match,
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

  async send(
    notification: INotification,
    event: WebsocketEvents,
    delay: number,
  ): Promise<void> {
    const socket = this.connectedClients.get(notification.userId);
    if (socket) {
      setTimeout(() => {
        socket.emit(event, notification.message);
      }, delay);
    }
  }

  async createIndex() {
    try {
      console.log(await this.redisClient.call('FT._LIST'));
      await this.redisClient.call('FT.DROPINDEX', 'dev:notifications:Idx');
      console.log('nodeenv', process.env.NODE_ENV);

      await this.redisClient.call(
        'FT.CREATE',
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
          process.env.NODE_ENV !== EnvironmentMode.TESTING
          ? 'notifications:Idx'
          : 'dev:notifications:Idx',
        'ON',
        'HASH',
        'PREFIX',
        '1',
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
          process.env.NODE_ENV !== EnvironmentMode.TESTING
          ? 'notifications'
          : 'dev:notifications',
        'SCHEMA',
        'subscriptionId',
        'TAG',
        'id',
        'TAG',
        'userId',
        'TAG',
        'expiresAt',
        'NUMERIC',
        'SORTABLE',
      );
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
      console.log(await this.redisClient.call('FT._LIST'));
      const todayTimestamp = new Date().getTime();
      console.log(
        '🚀 ~ NotificationsService ~ getExpiresInNotifications ~ todayTimestamp:',
        todayTimestamp,
      );
      const results = await this.redisClient.call(
        'FT.AGGREGATE',
        process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
          process.env.NODE_ENV !== EnvironmentMode.TESTING
          ? 'notifications:Idx'
          : 'dev:notifications:Idx',
        '*',
        'LOAD',
        '4',
        '@expiresAt',
        '@message',
        '@subscriptionId',
        'userId',
        'APPLY',
        `(@expiresAt - ${todayTimestamp})`,
        'AS',
        'differ', // Search query
        'FILTER',
        expiresInDuration === ExpiresInDuration.Day
          ? `@differ > 0 && @differ < ${expiresInDuration}`
          : expiresInDuration === ExpiresInDuration.Week
            ? `@differ > ${expiresInDuration} && @differ < ${expiresInDuration + 86400 * 1000}`
            : expiresInDuration === ExpiresInDuration.Month
              ? `@differ > ${expiresInDuration} && @differ < ${expiresInDuration + 86400 * 1000}`
              : null,
      );
      console.log('Search results:', results);
      return results;
    } catch (error) {
      console.error('Error searching data:', error);
    }
  }

  async getNotificationById(notificationId: string): Promise<any> {
    const index =
      process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
      process.env.NODE_ENV !== EnvironmentMode.TESTING
        ? 'notifications:Idx'
        : 'dev:notifications:Idx';
    notificationId = notificationId.replaceAll('-', '\\-');
    const notification = await this.redisClient.call(
      'FT.SEARCH',
      index,
      `@id:{${notificationId}}`,
    );
    if (!notification)
      throw new NotFoundException(
        'NotificationsService error: notification not found',
      );
    if (notification[2][7] !== '')
      throw new ConflictException(
        'NotificationsService error: notification has already been read',
      );
    return notification;
  }

  async updateNotification(notificationId: string): Promise<void> {
    const notification = await this.getNotificationById(notificationId);
    const readedAt = new Date().getTime();
    await this.redisClient.hset(notification[1], 'readAt', readedAt);
  }
}

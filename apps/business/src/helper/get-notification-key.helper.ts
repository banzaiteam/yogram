import { INotification } from '../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { Subscription } from '../infrastructure/entity/subscription.entity';
import { EnvironmentMode } from '../settings/configuration';

export const getNotificationKey = (
  subscription: Subscription,
  notification: INotification,
): string => {
  return `${
    process.env.NODE_ENV !== EnvironmentMode.DEVELOPMENT &&
    process.env.NODE_ENV !== EnvironmentMode.TESTING
      ? ''
      : 'dev:'
  }notifications:user:${subscription.userId}:notification:${notification.id}`;
};

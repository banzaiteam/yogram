export const HttpBusinessPath = {
  Subscribe: 'business/subscribe',
  CurrentSubscriptions: 'business/subscriptions/get',
  SuspendSubscription: 'business/subscriptions/:id/suspend',
  ActivateSubscription: 'business/subscriptions/:id/activate',
  PaypalProcess: 'business/paypal-proccess',
  SubscriptionsExpired: 'business/subscriptions/expired',
  SubscriptionsUpdated: 'business/subscriptions/updated',
  PostPaypalSse: 'business/subscriptions/sse',
  GetNotifications: 'business/notifications',
  Payments: 'business/payments',
  ReadNotification: 'business/notifications/read',
};

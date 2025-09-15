export interface INotification {
  id: string;
  subscriptionId: string;
  message: string;
  userId: string;
  createdAt: Date;
  readAt: Date;
  expiresAt: Date;
}

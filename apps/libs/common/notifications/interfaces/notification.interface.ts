export interface INotification {
  id: string;
  subscriptionId: string;
  message: string;
  userId: string;
  createdAt: number;
  readAt: number;
  expiresAt: number;
  delivered: boolean;
}

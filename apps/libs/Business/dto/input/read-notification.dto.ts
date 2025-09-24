import { IsUUID } from 'class-validator';

export class ReadNotificationDto {
  @IsUUID()
  notificationId: string;
}

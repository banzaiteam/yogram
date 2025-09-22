import { INotification } from '../../../../../apps/libs/common/notifications/interfaces/notification.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class NotificationResponseDto implements INotification {
  @IsUUID()
  id: string;
  subscriptionId: string;
  @IsUUID()
  userId: string;
  message: string;
  @ApiProperty({ description: 'timestamp' })
  readAt: number;
  @ApiProperty({ description: 'timestamp' })
  expiresAt: number;
  @ApiProperty({ description: 'timestamp' })
  createdAt: number;
}

import { ReadNotificationDto } from '../../../../../../apps/libs/Business/dto/input/read-notification.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function ReadNotificationSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Set notification as read',
    }),
    ApiBody({ type: ReadNotificationDto }),
    ApiResponse({
      status: 200,
    }),
    ApiResponse({
      status: 409,
      description:
        'NotificationsService error: notification has already been read',
    }),
    ApiResponse({
      status: 404,
      description: 'NotificationsService error: notification not found',
    }),
  );
}

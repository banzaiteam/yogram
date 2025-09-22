import { NotificationResponseDto } from '../../../../../../apps/libs/Business/dto/response/response-notification.dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function GetUserNotificationsSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Get all user`s notifications for last month',
    }),
    ApiResponse({
      status: 200,
      type: [NotificationResponseDto],
    }),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseSubscriptionsDto } from 'apps/libs/Users/dto/profile/response-subscriptions.dto';

export function GetAllSubscriptionsSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Get all user`s subscriptions',
    }),
    ApiResponse({
      status: 200,
      type: ResponseSubscriptionsDto,
    }),
    ApiResponse({
      status: 404,
      description: 'SubscriberQueryService error: user was not found',
    }),
  );
}

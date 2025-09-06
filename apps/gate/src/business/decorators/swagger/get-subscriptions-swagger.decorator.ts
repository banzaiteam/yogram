import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Subscription } from '../../../../../../apps/business/src/infrastructure/entity/subscription.entity';

export function GetSubscriptionsSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiOperation({
      summary: 'Get all user`s not expired subscriptions',
      description:
        'subscriptions can be suspended or active but while subscription is not expired, it can be activated again',
    }),
    ApiResponse({
      status: 200,
      type: Subscription,
    }),
    ApiResponse({
      status: 404,
      description: 'BusinessQueryService error: user`s subscriptions not found',
    }),
    ApiResponse({
      status: 500,
      description: 'BusinessCommandService error: subscription error',
    }),
  );
}

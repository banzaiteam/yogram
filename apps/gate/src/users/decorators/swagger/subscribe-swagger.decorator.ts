import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { SubscribeDto } from '../../../../../../apps/libs/Users/dto/subscriber/subscribe.dto';

export const SubscribeSwagger = () =>
  applyDecorators(
    ApiBody({ type: SubscribeDto }),
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({ status: 201 }),
    ApiResponse({
      status: 404,
      description:
        'ProfileCommandService error: subscriber  user was not found | ProfileCommandService error: profile to subscribe on was not found | SubscriberCommandService error: subscribtion does not exist',
    }),
    ApiResponse({
      status: 409,
      description:
        'SubscriberCommandService error: user cant subscribe to himself',
    }),
  );

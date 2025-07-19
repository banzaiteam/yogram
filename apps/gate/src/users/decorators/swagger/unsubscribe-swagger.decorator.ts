import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { UnsubscribeDto } from '../../../../../../apps/libs/Users/dto/subscriber/unsubscribe.dto';

export const UnsubscribeSwagger = () =>
  applyDecorators(
    ApiBody({ type: UnsubscribeDto }),
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({ status: 200 }),
    ApiResponse({
      status: 404,
      description:
        'ProfileCommandService error: subscriber  user was not found | ProfileCommandService error: profile to subscribe on was not found | SubscriberCommandService error: subscribtion does not exist',
    }),
  );

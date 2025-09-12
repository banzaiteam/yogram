import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsSse } from '../../../../../../apps/libs/Business/dto/response/subscriptions-sse.dto';

export const SubscriptionSseSwagger = () =>
  applyDecorators(
    ApiResponse({
      type: SubscriptionsSse,
    }),
    ApiResponse({
      status: 500,
      description:
        'Failed to connect to SSE endpoint | CORS error | Server unexpectedly closed the connection | Error: Invalid event stream data',
    }),
    ApiProduces('text/event-stream'),
    ApiOperation({
      description:
        'call it and get subscriptions ACTIVE, SUSPENDED, EXPIRED, UPDATED, FAILED events',
      summary: 'fires on subscriptions events',
    }),
  );

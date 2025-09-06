import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentType } from '../../../../../../apps/libs/Business/constants/payment-type.enum';

export function SuspendSubscriptionSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      example: 'I-1CWCLXSVTX7R',
    }),
    ApiQuery({
      name: 'payment',
      required: true,
      type: 'string',
      example: 'payment=paypal',
      enum: PaymentType,
    }),
    ApiOperation({
      summary: 'Suspend active subscription',
    }),
    ApiResponse({
      status: 200,
    }),
    ApiResponse({
      status: 404,
      description:
        'BusinessCommandService error: subscription does not exist | PayPalService error: subscription is suspended already',
    }),
  );
}

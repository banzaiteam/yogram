import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { PaymentType } from '../../../../../../apps/libs/Business/constants/payment-type.enum';

export function ActivateSubscriptionSwagger() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Authorization with bearer token',
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
      summary:
        'Activate suspended subscription. If it`s not expired then next scheduled payment will be charged. If yet one subscription exists, it will be switched to suspended',
    }),
    ApiResponse({
      status: 200,
    }),
    ApiResponse({
      status: 404,
      description:
        'BusinessCommandService error: subscription does not exist | PayPalService error: subscription is active already',
    }),
  );
}

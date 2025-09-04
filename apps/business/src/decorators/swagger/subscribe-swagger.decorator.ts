import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { SubscribeDto } from '../../../../../apps/libs/Business/dto/input/subscribe.dto';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';

export const SubscribeSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiQuery({
      name: 'payment',
      required: true,
      type: 'string',
      example: 'payment=paypal',
      enum: PaymentType,
    }),
    ApiBody({ type: SubscribeDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success and redirected',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'BusinessCommandService error: subscription error',
    }),
    ApiOperation({
      summary: 'Buy subscription for 1, 7 or 30 days using paypal or stripe',
    }),
  );

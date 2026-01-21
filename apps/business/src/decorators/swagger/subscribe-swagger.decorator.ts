import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { SubscribeDto } from '../../../../../apps/libs/Business/dto/input/subscribe.dto';
import { PaymentType } from '../../../../../apps/libs/Business/constants/payment-type.enum';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

@Expose()
class SubscribeResponseDto {
  @Expose()
  @IsString()
  link: string;
}

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
    ApiOperation({
      summary: 'Buy subscription for 1, 7 or 30 days using paypal or stripe',
      description:
        'Should redirect after completion. You cant have more than 2 not expired subscriptions. If you already have not expired subscription, the old one will be switched to suspended and the new one will be active.',
    }),
    ApiBody({ type: SubscribeDto }),
    ApiResponse({
      status: HttpStatus.TEMPORARY_REDIRECT,
      type: SubscribeResponseDto,
      description: 'Need to open this link in browser',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'BusinessCommandService error: user cant have more than 2 not expired subscriptions simultaniously | BusinessCommandService error: you cant have 2 subscriptions with the same subscription type',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'BusinessCommandService error: subscription error',
    }),
  );

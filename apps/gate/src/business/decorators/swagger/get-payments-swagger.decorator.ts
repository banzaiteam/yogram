import { PaymentsPaginatedResponseDto } from '../../../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { PaymentType } from '../../../../../../apps/libs/Business/constants/payment-type.enum';
import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const GetPaymentsSwagger = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: ' Authorization with bearer token',
    }),
    ApiResponse({
      status: 200,
      type: PaymentsPaginatedResponseDto,
      isArray: true,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'string',
      example: 'limit=8',
      default: 8,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'string',
      example: 'page=1',
      default: 1,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: 'string',
      format: 'field:asc|desc',
      example: 'createdAt:asc',
      default: null,
    }),
    ApiQuery({
      name: 'payment',
      required: true,
      type: 'string',
      example: 'payment=paypal',
      enum: PaymentType,
    }),
    ApiOperation({
      description:
        'api/v1/business/payments?payment=paypal&page=2&limit=8&sort=createdAt:desc',
      summary:
        'find user`s payments and sort by createdAt param. Return paginated array',
    }),
  );

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  IPagination,
  PaginationParams,
} from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { PaypalEvents } from '../../../../apps/business/src/payment/payment-services/paypal/constants/paypal-events.enum';
import { NotificationResponseDto } from '../../../../apps/libs/Business/dto/response/response-notification.dto';
import { SubscribeSwagger } from '../../../../apps/business/src/decorators/swagger/subscribe-swagger.decorator';
import { GetUserNotificationsSwagger } from './decorators/swagger/get-user-notifications-swagger.decorator';
import { ActivateSubscriptionSwagger } from './decorators/swagger/activate-subscription-swagger.decorator';
import { SuspendSubscriptionSwagger } from './decorators/swagger/suspend-subscription-swagger.decorator';
import { Subscription } from '../../../../apps/business/src/infrastructure/entity/subscription.entity';
import { SubscriptionsSse } from '../../../../apps/libs/Business/dto/response/subscriptions-sse.dto';
import { GetSubscriptionsSwagger } from './decorators/swagger/get-subscriptions-swagger.decorator';
import { SubscriptionSseSwagger } from './decorators/swagger/subscription-sse-swagger.decorator';
import { GetPaymentsSwagger } from './decorators/swagger/get-payments-swagger.decorator';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { User } from '../auth/decorators/user.decorator';
import { BusinessService } from './business.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';
import { ReadNotificationDto } from '../../../../apps/libs/Business/dto/input/read-notification.dto';
import { ReadNotificationSwagger } from './decorators/swagger/read-notification.swagger.decorator';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @ApiExcludeEndpoint()
  @Post('subscriptions/sse')
  async postPaypalSse(
    @Body() body: any,
    @Query('payment') payment: PaymentType,
  ) {
    const subscriptionSse: SubscriptionsSse = {
      event: body.event_type,
      userEmail: body.resource.subscriber.email_address,
      subscriptionId: body.resource.id,
    };
    return await this.businessService.postPaypalSse(subscriptionSse, payment);
  }

  @Public()
  @SubscriptionSseSwagger()
  @Get('subscriptions/sse')
  async sse(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();
      const microserviceResponse = await axios.get(
        [
          this.configService.get('BUSINESS_SERVICE_URL'),
          'business/subscriptions/sse',
        ].join('/'),
        {
          headers: { ...req.headers },
          responseType: 'stream',
        },
      );
      microserviceResponse.data.pipe(res);

      req.on('close', () => {
        res.end();
      });
    } catch (err) {
      console.log('🚀 ~ BusinessController ~ sse ~ error:', err);
    }
  }

  @HttpCode(200)
  @SubscribeSwagger()
  @Post('subscriptions/subscribe')
  //* the second one subscription should starts from end of the first one (get first expiresAt, get time difference between now and first expiresAt, add this to startAt of the new subscription)
  //* check if current subscription exists(expiresAt>now), if yes, current subscriptionType !== new subscriptionType(you cant have 2 the same subscr like 30 and 30) +
  //* when activating suspended subscription need to check if have another one and if it active need toggle it to suspended +
  //* when buy the second subscription, need to check if have another active subscr, if have - suspend it22 +
  //* when renew have been proceeded need to do event and patch subscr expiresAt +?
  async subscribe(
    @User('id') id: string,
    @Body() subscribeDto: SubscribeDto,
    @Query('payment') payment: PaymentType,
    @Res() res: Response,
  ): Promise<any> {
    subscribeDto.userId = id;
    subscribeDto.paymentType = PaymentType[payment.toUpperCase()];
    const response = await this.businessService.subscribe(
      subscribeDto,
      payment,
    );
    console.log('link:', response.link);
    res.status(200).redirect(303, response.link);
  }

  @Public()
  @ApiExcludeEndpoint()
  @Post('paypal-proccess')
  async paypalProcess(
    @Req() req: Request,
    @Query('payment') payment: PaymentType,
  ): Promise<void> {
    if (req.body.event_type === PaypalEvents.BillingSubscriptionActivated) {
      return await this.businessService.paypalProccess(
        req.body.resource.id,
        payment,
      );
    }
  }

  @Public()
  @HttpCode(200)
  @ApiExcludeEndpoint()
  @Post('subscriptions/expired')
  async subscriptionExpiredEvent(
    @Body() body: any,
    @Query('payment') payment: PaymentType,
    @Res() res: Response,
  ): Promise<void> {
    if (body.event_type === PaypalEvents.BillingSubscriptionExpired) {
      const subscriptionId = body.resource.id;
      await this.businessService.subscriptioExpiredEvent(
        subscriptionId,
        payment,
      );
      res.sendStatus(200);
    }
  }

  @Public()
  @HttpCode(200)
  @ApiExcludeEndpoint()
  @Post('subscriptions/updated')
  async subscriptionUpdatedEvent(
    @Body() body: any,
    @Query('payment') payment: PaymentType,
    @Res() res: Response,
  ): Promise<void> {
    if (body.event_type === PaypalEvents.PaymentSaleCompleted) {
      const subscriptionId = body.resource.id;
      await this.businessService.subscriptioUpdatedEvent(
        subscriptionId,
        payment,
      );
      res.sendStatus(200);
    }
  }

  @SuspendSubscriptionSwagger()
  @Patch('subscriptions/:id/suspend')
  async suspendSubscription(
    @Param('id') id: string,
    @Query('payment') payment: PaymentType,
  ): Promise<void> {
    return await this.businessService.suspendSubscription(id, payment);
  }

  @ActivateSubscriptionSwagger()
  @Patch('subscriptions/:id/activate')
  async activateSubscription(
    @Param('id') id: string,
    @Query('payment') payment: PaymentType,
  ): Promise<void> {
    return await this.businessService.activateSubscription(id, payment);
  }

  @GetPaymentsSwagger()
  @Get('payments')
  async getPayments(
    @User('id') userId: string,
    @Query('payment') payment: PaymentType,
    @PaginationParams() pagination: IPagination,
    @SortingParams(['createdAt', 'paymentType']) sorting?: ISorting,
  ): Promise<PaymentsPaginatedResponseDto> {
    const filter = `userId:eq:${userId}`;
    const payments = await this.businessService.getPayments(
      payment,
      pagination,
      sorting,
      filter,
    );
    return plainToInstance(PaymentsPaginatedResponseDto, payments);
  }

  @GetSubscriptionsSwagger()
  @Get('subscriptions')
  async getCurrentSubscriptions(
    @User('id') id: string,
  ): Promise<Subscription[]> {
    return await this.businessService.getCurrentSubscriptions(id);
  }

  @GetUserNotificationsSwagger()
  @Get('notifications')
  async getUserNotifications(
    @User('id') userId: string,
  ): Promise<NotificationResponseDto[]> {
    return await this.businessService.getUserNotifications(userId);
  }

  @ReadNotificationSwagger()
  @Patch('notifications/read')
  async readNotification(
    @Body() { notificationId }: ReadNotificationDto,
  ): Promise<void> {
    return await this.businessService.readNotification(notificationId);
  }
}

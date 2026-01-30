import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { GetCurrentSubscriptionsQuery } from '../application/query/get-current-subscriptions-query.handler';
import { ActivateSubscriptionCommand } from '../application/command/activate-subscription-command.handler';
import { SubscriptionUpdatedCommand } from '../application/command/subscription-updated.handler';
import { SuspendSubscriptionCommand } from '../application/command/suspend-subscription.handler';
import { SubscriptionExpiredCommand } from '../application/command/subscription-expired.handler';
import { GetUserNotificationsQuery } from '../application/query/get-user-notifications.handler';
import { SaveSubscriptionCommand } from '../application/command/save-subscribtion.handler';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { GetPaymentsQuery } from '../application/query/get-payments.handler';
import { SubscribeCommand } from '../application/command/subscribe.handler';
import { Subscription } from '../infrastructure/entity/subscription.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { fromEvent, map, Observable } from 'rxjs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import {
  IPagination,
  PaginationParams,
} from '../../../../apps/libs/common/pagination/decorators/pagination.decorator';
import {
  ISorting,
  SortingParams,
} from '../../../../apps/libs/common/pagination/decorators/sorting.decorator';
import {
  FilteringParams,
  IFiltering,
} from '../../../../apps/libs/common/pagination/decorators/filtering.decorator';
import { NotificationResponseDto } from 'apps/libs/Business/dto/response/response-notification.dto';
import { ReadNotificationCommand } from '../application/command/read-notification.command';
import { ReadNotificationDto } from '../../../../apps/libs/Business/dto/input/read-notification.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CancelSubscriptionCommand } from '../application/command/cancel-subscription.handler';

@Controller()
export class BusinessController {
  private eventEmitter: EventEmitter2;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {
    this.eventEmitter = new EventEmitter2();
  }

  @Post('business/subscribe')
  async subscribe(@Body() subscribeDto: SubscribeDto): Promise<any> {
    return await this.commandBus.execute(new SubscribeCommand(subscribeDto));
  }

  @Post('business/paypal-proccess')
  async paypalProcess(
    @Body('subscriptionId') subscriptionId: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log(
      '🚀 ~ BusinessController ~ paypalProcess ~ subscriptionId:',
      subscriptionId,
    );
    const subscription = await this.commandBus.execute(
      new SaveSubscriptionCommand(subscriptionId),
    );
    res.status(200).json(subscription);
    // let page = this.configService.get<string>('PROFILE_SETTINGS_PAGE');
    // page = page.replace('replace', subscription.userId);
    // console.log('🚀 ~ BusinessController ~ paypalProcess ~ page:', page);
    // res.redirect(301, 'https://www.google.com/');
  }

  @HttpCode(200)
  @Post('business/subscriptions/updated')
  async subscriptionUpdatedEvent(
    @Body() body: { subscriptionId: string; expiresAt: Date },
  ): Promise<void> {
    const { subscriptionId } = body;
    console.log('business/subscriptions/updated ~ body:', body);
    console.log('business/subscriptions/updated', subscriptionId);
    return await this.commandBus.execute(
      new SubscriptionUpdatedCommand(subscriptionId),
    );
  }

  @Post('business/subscriptions/expired')
  async subscriptionExpiredEvent(
    @Body('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    console.log('business/subscriptions/expired', subscriptionId);
    return await this.commandBus.execute(
      new SubscriptionExpiredCommand(subscriptionId),
    );
  }

  @Post('business/subscriptions/sse')
  async postPaypalSse(@Body() subscriptionsSse: any) {
    this.eventEmitter.emit('subscriptions.event', subscriptionsSse);
  }

  @Sse('business/subscriptions/sse')
  sse(): Observable<any> {
    try {
      return fromEvent(this.eventEmitter, 'subscriptions.event').pipe(
        map((payload) => ({
          data: JSON.stringify(payload),
        })),
      );
    } catch (err) {
      console.log('🚀 ~ BusinessController ~ sse ~ error:', err);
    }
  }

  @Patch('business/subscriptions/:id/suspend')
  async suspendSubscription(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new SuspendSubscriptionCommand(id));
  }

  @Patch('business/subscriptions/:id/activate')
  async activateSubscription(@Param('id') id: string): Promise<void> {
    console.log('🚀 ~ BusinessController ~ activateSubscription ~ id:', id);
    return await this.commandBus.execute(new ActivateSubscriptionCommand(id));
  }

  @Patch('business/subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') id: string): Promise<void> {
    console.log('🚀 ~ BusinessController ~ cancelSubscription ~ id:', id);
    return await this.commandBus.execute(new CancelSubscriptionCommand(id));
  }

  @Get('business/subscriptions/get/:id')
  async getCurrentSubscriptions(
    @Param('id') userId: string,
  ): Promise<Subscription[]> {
    return await this.queryBus.execute(
      new GetCurrentSubscriptionsQuery(userId),
    );
  }

  @Get('business/payments')
  async getPayments(
    @PaginationParams() pagination: IPagination,
    @FilteringParams(['userId']) filtering: IFiltering,
    @SortingParams(['createdAt', 'paymentType']) sorting?: ISorting,
  ): Promise<PaymentsPaginatedResponseDto> {
    return await this.queryBus.execute(
      new GetPaymentsQuery(pagination, sorting, filtering),
    );
  }

  @Get('business/notifications/:id')
  async getUserNotifications(
    @Param('id') id: string,
  ): Promise<NotificationResponseDto[]> {
    console.log('🚀 ~ BusinessController ~ getUserNotifications ~ id:', id);
    return await this.queryBus.execute(new GetUserNotificationsQuery(id));
  }

  @Patch('business/notifications/read')
  async readNotification(
    @Body() { notificationId }: ReadNotificationDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new ReadNotificationCommand(notificationId),
    );
  }
}

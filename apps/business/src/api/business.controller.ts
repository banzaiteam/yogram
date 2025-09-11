import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { GetCurrentSubscriptionsQuery } from '../application/query/get-current-subscriptions-query.handler';
import { SuspendSubscriptionCommand } from '../application/command/suspend-subscription.handler';
import { ActivateSubscriptionCommand } from '../application/command/activate-subscription-command.handler';
import { SubscriptionUpdatedCommand } from '../application/command/subscription-updated.handler';
import { SubscriptionExpiredCommand } from '../application/command/subscription-expired.handler';
import { Body, Controller, Get, Param, Patch, Post, Sse } from '@nestjs/common';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { SubscribeCommand } from '../application/command/subscribe.handler';
import { SaveSubscriptionCommand } from '../application/command/save-subscribtion.handler';
import { Subscription } from '../infrastructure/entity/subscription.entity';
import { GetPaymentsQuery } from '../application/query/get-payments.handler';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { fromEvent, map, Observable } from 'rxjs';
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

@Controller()
export class BusinessController {
  private eventEmitter: EventEmitter2;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
  ): Promise<void> {
    await this.commandBus.execute(new SaveSubscriptionCommand(subscriptionId));
  }

  @Post('business/subscriptions/updated')
  async subscriptionUpdatedEvent(
    @Body() body: { subscriptionId: string; expiresAt: Date },
  ) {
    const { subscriptionId, expiresAt } = body;
    return await this.commandBus.execute(
      new SubscriptionUpdatedCommand(subscriptionId, expiresAt),
    );
  }

  @Post('business/subscriptions/expired')
  async subscriptionExpiredEvent(
    @Body('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    console.log('subscriptionExpredEvent:', subscriptionId);

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
}

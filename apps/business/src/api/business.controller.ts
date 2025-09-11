import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Sse,
} from '@nestjs/common';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SubscribeCommand } from '../application/command/subscribe.handler';
import { Request, Response } from 'express';
import { PaypalEvents } from '../payment/payment-services/paypal/constants/paypal-events.enum';
import { SaveSubscriptionCommand } from '../application/command/save-subscribtion.handler';
import { Subscription } from '../infrastructure/entity/subscription.entity';
import { GetCurrentSubscriptionsQuery } from '../application/query/get-current-subscriptions-query.handler';
import { SuspendSubscriptionCommand } from '../application/command/suspend-subscription.handler';
import { ActivateSubscriptionCommand } from '../application/command/activate-subscription-command.handler';
import { SubscriptionUpdatedCommand } from '../application/command/subscription-updated.handler';
import { SubscriptionExpiredCommand } from '../application/command/subscription-expired.handler';
import { GetPaymentsQuery } from '../application/query/get-payments.handler';
import { PaymentsPaginatedResponseDto } from '../../../../apps/libs/Business/dto/response/payments-paginated-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
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
import { SubscriptionsSse } from 'apps/libs/Business/dto/response/subscriptions-sse.dto';

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
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (req.body.event_type === PaypalEvents.BillingSubscriptionActivated) {
        const subscriptionId = req.body.resource.id;
        await this.commandBus.execute(
          new SaveSubscriptionCommand(subscriptionId),
        );
        res.status(200).json();
      }
    } catch (err) {
      console.log('BusinessController ~ business/paypal-hook ~ error:', err);
      throw new InternalServerErrorException(
        'BusinessController error: paypalProcess',
      );
    }
  }

  @Post('business/subscriptions/updated')
  async subscriptionUpdatedSse(@Body() body: any) {
    console.log('SubscriptionUpdated:', body.resource);
    const subscriptionId = body.resource.id;
    const expiresAt = body.resource.billing_info.next_billing_time;
    return await this.commandBus.execute(
      new SubscriptionUpdatedCommand(subscriptionId, expiresAt),
    );
    //todo* find subscription by id, update expresAt and create new payment with subscriptionId
  }

  @Post('business/subscriptions/expired')
  async subscriptionExpredEvent(@Body() body: any): Promise<void> {
    console.log('subscriptionExpredEvent:', body.resource);
    const subscriptionId = body.resource.id;
    return await this.commandBus.execute(
      new SubscriptionExpiredCommand(subscriptionId),
    );
  }

  @Public()
  @Post('business/subscriptions/sse')
  async postPaypalSse(@Body() body: any) {
    const subscriptionSse: SubscriptionsSse = {
      event: body.event_type,
      userEmail: body.resource.subscriber.email_address,
      subscriptionId: body.resource.id,
    };
    this.eventEmitter.emit('subscriptions.event', subscriptionSse);
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

import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SubscribeCommand } from '../application/command/subscribe.handler';
import { Request, Response } from 'express';
import { PaypalEvents } from '../payment/payment-services/paypal/constants/paypal-events.enum';
import { SaveSubscriptionCommand } from '../application/command/save-subscribtion.handler';
import axios from 'axios';
import { Subscription } from '../infrastructure/entity/subscription.entity';
import { GetCurrentSubscriptionsQuery } from '../application/query/get-current-subscriptions-query.handler';
import { SuspendSubscriptionCommand } from '../application/command/suspend-subscription.handler';
import { ActivateSubscriptionCommand } from '../application/command/activate-subscription-command.handler';
import { SubscriptionUpdatedCommand } from '../application/command/subscription-updated.handler';
import { SubscriptionExpiredCommand } from '../application/command/subscription-expired.handler';

@Controller()
export class BusinessController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
    const subscriptionId = 'I-X4ABDDVC0UHC';
    return await this.commandBus.execute(
      new SubscriptionExpiredCommand(subscriptionId),
    );
  }

  @Post('business/postPaypalSse')
  async postPaypalSse(@Body() body: any) {
    const email = body.resource.subscriber.email_address;
    console.log('🚀 ~ BusinessController ~ postPaypalSse ~ email:', email);
    await axios.get(
      `http://localhost:3006/api/v1/business/payment-sse?email=${email}`,
    );
  }

  @Get('business/payment-sse')
  async paymentSse(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();
      const data = req.query?.email;
      if (data) {
        console.log('🚀 ~ BusinessController ~ paymentSse ~ data:', data);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('PostsController ~ sse-cancel-token ~ error:', error);
      res.write(`data: ${error}\n\n`);
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
}

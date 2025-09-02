import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SubscribeCommand } from '../application/command/subscribe.handler';
import { PayPalCapturePaymentCommand } from '../application/command/paypal-capture-payment.handler';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PaypalEvents } from '../payment/payment-services/paypal/constants/paypal-events.enum';
import { IPaymentService } from '../payment/interfaces/payment-service.interface';
import { SubscriptionStatus } from '../payment/payment-services/paypal/constants/subscription-status.enum';
import { SaveSubscriptionCommand } from '../application/command/save-subscribtion.handler';
import { SaveSubscriptionDto } from '../payment/payment-services/paypal/dto/save-subscription.dto';

@Controller()
export class BusinessController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly paymentService: IPaymentService,
  ) {}

  @Post('business/subscribe')
  async subscribe(
    @Body() updatePlan: SubscribeDto,
    @Res() res: Response,
  ): Promise<void> {
    const link = await this.commandBus.execute(
      new SubscribeCommand(updatePlan),
    );
    res.redirect(link);
  }

  @ApiExcludeEndpoint()
  @Get('business/paypal-capture')
  async paypalSuccess(@Query('token') token: string): Promise<string> {
    console.log('ggggg');

    return await this.commandBus.execute(
      new PayPalCapturePaymentCommand(token),
    );
  }

  @Post('business/paypal-hook')
  async paypalHook(@Req() req: Request, @Res() res: Response) {
    // try {
    // res.writeHead(200, {
    //   'Content-Type': 'text/event-stream',
    //   'Cache-Control': 'no-cache',
    //   Connection: 'keep-alive',
    // });
    // res.flushHeaders();
    const body = req.body;
    let data;
    if (body.event_type === PaypalEvents.BillingSubscriptionActivated) {
      console.log('🚀 ~ BusinessController ~ paypalHook ~ data:', body);
      const plan = await this.paymentService.getPlan(body.resource.plan_id);
      if (!plan) throw new InternalServerErrorException('plan does not exists');
      const product = await this.paymentService.getProduct(plan.product_id);
      if (!product)
        throw new InternalServerErrorException('product does not exists');
      const { userId, paymentType, subscriptionType } = JSON.parse(
        product.description,
      );
      const subscribeId = body.resource.id;
      const startAt = body.resource.start_time;
      const startDate = new Date(startAt);
      const expiresAt = new Date(
        startDate.setDate(startDate.getDate() + subscriptionType),
      );

      const saveSubscriptionDto: SaveSubscriptionDto = {
        userId,
        subscribeId,
        startAt,
        expiresAt,
        paymentType,
        subscriptionType: subscriptionType,
        status: SubscriptionStatus.Active,
      };
      const subscription = await this.commandBus.execute(
        new SaveSubscriptionCommand(saveSubscriptionDto),
      );
      res.status(200).json();
    }
    // res.write(`data: ${JSON.stringify(data)}\n\n`);

    req.on('close', () => {
      res.end();
    });
    // } catch (error) {
    //   console.log('BusinessController ~ business/paypal-hook ~ error:', error);

    // res.write(`data: ${error}\n\n`);
    // }
  }
}

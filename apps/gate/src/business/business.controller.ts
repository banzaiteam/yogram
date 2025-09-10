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
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { User } from '../auth/decorators/user.decorator';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscribeSwagger } from '../../../../apps/business/src/decorators/swagger/subscribe-swagger.decorator';
import { Subscription } from '../../../../apps/business/src/infrastructure/entity/subscription.entity';
import { BusinessService } from './business.service';
import { GetSubscriptionsSwagger } from './decorators/swagger/get-subscriptions-swagger.decorator';
import { SuspendSubscriptionSwagger } from './decorators/swagger/suspend-subscription-swagger.decorator';
import { ActivateSubscriptionSwagger } from './decorators/swagger/activate-subscription-swagger.decorator';
import axios from 'axios';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Public()
  @Get('payment-sse')
  async fileUploaded(@Req() req: Request, @Res() res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders();

      const microserviceResponse = await axios.get(
        ['http://localhost:3006/api/v1', 'business/payment-sse'].join('/'),
        {
          responseType: 'stream',
          headers: { ...req.headers },
        },
      );
      console.log(
        '🚀 ~ BusinessController ~ fileUploaded ~ microserviceResponse:',
        microserviceResponse.data,
      );
      microserviceResponse.data.pipe(res);

      req.on('close', () => {
        res.end();
      });
    } catch (error) {
      console.log('🚀 ~ PostsController ~ posts-sse ~ error:', error);
      res.write(`data: ${error}\n\n`);
    }
  }

  @HttpCode(200)
  @SubscribeSwagger()
  @Post('subscriptions/subscribe')
  //todo* check if current subscription exists(expiresAt>now), if yes, current subscriptionType !== new subscriptionType(you cant have 2 the same subscr like 30 and 30) +
  //todo* when activating suspended subscription need to check if have another one and if it active need toggle it to suspended +
  //todo* when buy the second subscription, need to check if have another active subscr, if have - suspend it22 +
  //todo* when renew have been proceeded need to do event and patch subscr expiresAt +?
  //todo* the second one subscription should starts from end of the first one (get first expiresAt, get time difference between now and first expiresAt, add this to startAt of the new subscription)
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

  @GetSubscriptionsSwagger()
  @Get('subscriptions')
  async getCurrentSubscriptions(
    @User('id') id: string,
  ): Promise<Subscription[]> {
    return await this.businessService.getCurrentSubscriptions(id);
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
}

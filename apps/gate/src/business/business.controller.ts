import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { User } from '../auth/decorators/user.decorator';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscribeSwagger } from '../../../../apps/business/src/decorators/swagger/subscribe-swagger.decorator';
import { Subscription } from '../../../../apps/business/src/infrastructure/entity/subscription.entity';
import { BusinessService } from './business.service';
import { Response } from 'express';
import { GetSubscriptionsSwagger } from './decorators/swagger/get-subscriptions-swagger.decorator';
import { SuspendSubscriptionSwagger } from './decorators/swagger/suspend-subscription-swagger.decorator';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @HttpCode(200)
  @SubscribeSwagger()
  @Post('subscribe')
  //todo* check if current subscription exists(expiresAt>now), if yes, current subscriptionType !== new subscriptionType(you cant have 2 the same subscr like 30 and 30)
  //todo* when activating suspended subscription need to check if have another one and if it active need toggle it to suspended
  //todo* when buy the second subscription, need to check if have another active subscr, if have - suspend it22
  //todo* when renew have been proceeded need to do event and patch subscr expiresAt
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
    console.log('🚀 ~ BusinessController ~ subscribe ~ response:', response);
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
  @Patch('subscription/:id/suspend')
  async suspendSubscription(
    @Param('id') id: string,
    @Query('payment') payment: PaymentType,
  ): Promise<void> {
    return await this.businessService.suspendSubscription(id, payment);
  }
}

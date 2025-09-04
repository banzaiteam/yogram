import { Body, Controller, HttpCode, Post, Query, Res } from '@nestjs/common';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { SubscribeDto } from '../../../libs/Business/dto/input/subscribe.dto';
import { User } from '../auth/decorators/user.decorator';
import { HttpBusinessPath } from '../../../../apps/libs/Business/constants/path.constant';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';
import { SubscribeSwagger } from '../../../../apps/business/src/decorators/swagger/subscribe-swagger.decorator';
import { Response } from 'express';

@Controller('business')
export class BusinessController {
  constructor(private readonly gateService: GateService) {}

  @HttpCode(200)
  @SubscribeSwagger()
  @Post('subscribe')
  async subscribe(
    @User('id') id: string,
    @Body() subscribeDto: SubscribeDto,
    @Query('payment') payment: PaymentType,
    @Res() res: Response,
  ): Promise<any> {
    subscribeDto.userId = id;
    subscribeDto.paymentType = PaymentType[payment.toUpperCase()];
    const path = [HttpBusinessPath.Subscribe, `payment=${payment}`].join('?');
    const response = await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      subscribeDto,
      {},
    );
    console.log('link:', response.link);
    res.status(200).redirect(303, response.link);
  }
}

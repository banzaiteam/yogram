import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BusinessService } from './business.service';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { UpdatePlanDto } from '../../../../apps/libs/Business/dto/input/update-plan.dto';
import { User } from '../auth/decorators/user.decorator';
import { HttpBusinessPath } from '../../../../apps/libs/Business/constants/path.constant';
import { PaymentType } from '../../../../apps/libs/Business/constants/payment-type.enum';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly gateService: GateService,
  ) {}

  @Post('update-plan')
  async updatePlan(
    @User('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
    @Query('payment') payment: string,
  ): Promise<void> {
    updatePlanDto.id = id;
    updatePlanDto.paymentType = PaymentType[payment.toUpperCase()];
    const path = [HttpBusinessPath.UpdatePlan, `payment=${payment}`].join('?');
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      path,
      updatePlanDto,
      {},
    );
  }
}

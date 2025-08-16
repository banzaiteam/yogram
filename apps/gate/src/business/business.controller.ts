import { Body, Controller, Get, Post } from '@nestjs/common';
import { BusinessService } from './business.service';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { UpdatePlanDto } from '../../../../apps/libs/Business/dto/input/update-plan.dto';
import { User } from '../auth/decorators/user.decorator';

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
  ): Promise<void> {
    updatePlanDto.id = id;
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      'business/update-plan',
      updatePlanDto,
      {},
    );
  }
}

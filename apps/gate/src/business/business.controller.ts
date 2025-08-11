import { Controller, Get, Post } from '@nestjs/common';
import { BusinessService } from './business.service';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpServices } from '../../../../apps/gate/common/constants/http-services.enum';
import { Public } from '../../../../apps/gate/common/decorators/public.decorator';

@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly gateService: GateService,
  ) {}

  @Public()
  @Post()
  async get(): Promise<void> {
    return await this.gateService.requestHttpServicePost(
      HttpServices.Business,
      'business/update-plan',
      {},
      {},
    );
  }
}

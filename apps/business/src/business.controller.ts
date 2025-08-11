import { Controller, Get, Post } from '@nestjs/common';
import { BusinessService } from './business.service';

@Controller()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('business/update-plan')
  async updatePlan(): Promise<void> {
    console.log('business/get');
  }
}

import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from '../../../../apps/libs/gateService';

@Module({
  imports: [HttpModule],
  controllers: [BusinessController],
  providers: [BusinessService, GateService],
})
export class BusinessModule {}

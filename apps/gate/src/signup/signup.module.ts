import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { GateService } from '../../../../apps/libs/gateService';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SignupController],
  providers: [SignupService, GateService],
})
export class SignupModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from 'apps/libs/gateService';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, { provide: 'GateService', useClass: GateService }],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { GateService } from 'apps/libs/gateService';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersService, GateService],
})
export class UsersModule {}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GateService } from '../../libs/gateService';
import { EventSubscribe } from 'apps/libs/common/message-brokers/rabbit/decorators/event-subscriber.decorator';
import { HttpServices } from '../common/constants/http-services.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gateService: GateService,
  ) {}

  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    const data = await this.gateService.requestHttpServiceGet(
      HttpServices.Users,
      'users',
      {},
    );
    return data;
  }
}

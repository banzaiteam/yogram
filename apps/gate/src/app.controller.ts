import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_REQUEST_SERVICE')
    private readonly userRequestService: ClientProxy,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    const result = await firstValueFrom(
      this.userRequestService.send({ cmd: 'check_users' }, { userId: 'loh' }),
    );
    return result;
  }
}

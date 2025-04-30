import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @MessagePattern({ cmd: 'check_users' })
  async handleCheckPayment(@Payload() data: { userId: string }) {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return { success: true, userId: data.userId };
  }
}

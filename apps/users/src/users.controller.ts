import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @Get('users')
  getUsers(): any[] {
    return [
      { id: '1', name: 'Alice2' },
      { id: '2', name: 'Bob' },
    ];
  }
}

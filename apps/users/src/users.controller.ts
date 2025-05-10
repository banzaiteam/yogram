import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'apps/libs/Users/dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @Post('users/create')
  create(@Body() createUserDto: CreateUserDto): void {
    this.usersService.create(createUserDto);
  }

  @Get('users')
  getUsers(): any[] {
    return [
      { id: '1', name: 'Alice2' },
      { id: '2', name: 'Bob' },
    ];
  }
}

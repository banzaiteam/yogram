import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './features/create/command/create-user.command';

@Controller()
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  getHello(): string {
    return 'hello';
  }

  @Post('users/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get('users')
  getUsers(): any[] {
    return [
      { id: '1', name: 'Alice2' },
      { id: '2', name: 'Bob' },
    ];
  }
}

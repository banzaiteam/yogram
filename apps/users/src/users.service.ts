import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from 'apps/libs/Users/dto/create-user.dto';
import { CreateUserCommand } from './features/create/command/create-user.command';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus) {}
  async create(createUserDto: CreateUserDto): Promise<void> {
    this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  getHello(): string {
    return 'Hello Users!';
  }
}

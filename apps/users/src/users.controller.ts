import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './features/create/command/create-user.command';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { IdDto } from '../../../apps/libs/common/dto/id.dto';
import { FindUserByIdQuery } from './features/find-one-by-id/query/find-one-by-id.query';
import { EmailVerifyCommand } from './features/email-verify/email-verify.command';

@Controller()
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('users/:id')
  async findOneById(@Param() id: IdDto): Promise<ResponseUserDto> {
    return await this.queryBus.execute(new FindUserByIdQuery(id));
  }

  @Post('users/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Post('users/email-verify')
  async emailVerify(@Body() email: string): Promise<void> {
    const parsedEmail = Object.keys(email)[0];
    await this.commandBus.execute(new EmailVerifyCommand(parsedEmail));
  }

  @Get('users')
  getUsers(): any[] {
    return [
      { id: '1', name: 'Alice2' },
      { id: '2', name: 'Bob' },
    ];
  }
}

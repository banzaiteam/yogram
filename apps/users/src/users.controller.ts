import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './features/create/command/create-user.command';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { EmailVerifyCommand } from './features/email-verify/email-verify.command';
import { FindUserByCriteriaDto } from 'apps/libs/Users/dto/user/find-user-criteria.dto';
import { FindUserByCriteriaQuery } from './features/find-by-criteria/query/find-users-by-criteria.query';
import { UserLoginQuery } from './features/user-login/query/user-login.query';
import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('users/login/:email')
  async userLogin(@Param() email: string): Promise<ResponseLoginDto> {
    return await this.queryBus.execute(new UserLoginQuery(email['email']));
  }

  @Get('users')
  async findUserByCriteria(
    @Query() findUserByCriteriaDto: FindUserByCriteriaDto,
  ): Promise<ResponseUserDto> {
    return await this.queryBus.execute(
      new FindUserByCriteriaQuery(findUserByCriteriaDto),
    );
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
}

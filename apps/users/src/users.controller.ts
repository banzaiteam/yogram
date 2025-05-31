import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './features/create/command/create-user.command';
import { ResponseUserDto } from '../../../apps/libs/Users/dto/user/response-user.dto';
import { EmailVerifyCommand } from './features/email-verify/email-verify.command';
import { FindUserByCriteriaDto } from '../../../apps/libs/Users/dto/user/find-user-criteria.dto';
import { FindUserByCriteriaQuery } from './features/find-by-criteria/query/find-users-by-criteria.query';
import { UserLoginQuery } from './features/user-login/query/user-login.query';
import { ResponseLoginDto } from '../../../apps/libs/Users/dto/user/response-login.dto';
import { UpdateUserCriteria } from '../../../apps/libs/Users/dto/user/update-user-criteria.dto';
import { UpdateUserDto } from '../../../apps/libs/Users/dto/user/update-user.dto';
import { UpdateUserByCriteriaCommand } from './features/update/command/update-user-by-criteria.command';
import { GoogleSignupDto } from '../../../apps/libs/Users/dto/user/google-signup.dto';
import { CreateUserGoogleCommand } from './features/create-google/command/create-user-google.command';
import { FindUserByProviderIdQuery } from './features/find-by-providerid/query/find-user-by-providerId.query';
import { ResponseProviderDto } from '../../../apps/libs/Users/dto/provider/response-provider.dto';
import { ProviderQueryService } from './provider-query.service';
import { GoogleResponse } from './users-command.service';

@Controller()
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly providerQueryService: ProviderQueryService,
  ) {}

  @Get('users/login/:email')
  async userLogin(@Param() email: string): Promise<ResponseLoginDto | null> {
    return await this.queryBus.execute(new UserLoginQuery(email['email']));
  }

  @Get('users')
  async findUserByCriteria(
    @Query() findUserByCriteriaDto: FindUserByCriteriaDto,
  ): Promise<ResponseUserDto | null> {
    console.log('findUserByCriteria.....');

    return await this.queryBus.execute(
      new FindUserByCriteriaQuery(findUserByCriteriaDto),
    );
  }

  @Get('users/findone/:providerid')
  async findUserByProviderId(
    @Param('providerid') providerId: string,
  ): Promise<ResponseUserDto | null> {
    return await this.queryBus.execute(
      new FindUserByProviderIdQuery(providerId),
    );
  }

  @Get('users/provider/:providerId')
  async findProviderByProviderId(
    @Param('providerId') providerId: string,
  ): Promise<ResponseProviderDto | null> {
    return await this.providerQueryService.findProviderByProviderId(providerId);
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

  // find user by id, username or email and update
  @Patch('users/update')
  async update(
    @Body()
    payload: UpdateUserCriteria & UpdateUserDto,
  ): Promise<void> {
    const criteria = payload['criteria'];
    const updateUserDto = payload['updateUserDto'];
    return await this.commandBus.execute(
      new UpdateUserByCriteriaCommand(criteria, updateUserDto),
    );
  }

  @Post('users/google')
  async createWithGoogle(
    @Body() googleSignupDto: GoogleSignupDto,
  ): Promise<GoogleResponse> {
    return await this.commandBus.execute(
      new CreateUserGoogleCommand(googleSignupDto),
    );
  }
}

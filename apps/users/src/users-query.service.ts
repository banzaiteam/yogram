import { Injectable, NotFoundException } from '@nestjs/common';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { User } from './infrastructure/entity/User.entity';
import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';
import { UserCriteria } from './features/find-by-criteria/query/find-users-by-criteria.query';

@Injectable()
export class UsersQueryService {
  constructor(
    private readonly userQueryRepository: IUsersQueryRepository<
      User,
      ResponseUserDto
    >,
  ) {}
  //
  async userLoginQuery(email: string): Promise<ResponseLoginDto> {
    return await this.userQueryRepository.userLoginQuery(email);
  }

  async findUserByCriteria(criteria: UserCriteria): Promise<ResponseUserDto> {
    const user = await this.userQueryRepository.findUserByCriteria(criteria);
    if (!user) throw new NotFoundException('user was not found');
    return user;
  }

  async findUserByProviderId(providerId: string): Promise<ResponseUserDto> {
    return await this.userQueryRepository.findUserByProviderId(providerId);
  }
}

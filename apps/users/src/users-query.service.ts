import { Injectable } from '@nestjs/common';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}
  async userLoginQuery(email: string): Promise<ResponseLoginDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    return await this.userQueryRepository.userLoginQuery(
      email,
      queryRunner.manager,
    );
  }

  async findUserByCriteria(criteria: UserCriteria): Promise<ResponseUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    return await this.userQueryRepository.findUserByCriteria(
      criteria,
      queryRunner.manager,
    );
  }

  async findUserByProviderId(providerId: string): Promise<ResponseUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    return await this.userQueryRepository.findUserByProviderId(
      providerId,
      queryRunner.manager,
    );
  }
}

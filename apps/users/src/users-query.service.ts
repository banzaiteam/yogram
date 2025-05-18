import { Injectable } from '@nestjs/common';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { User } from './infrastructure/entity/User.entity';
import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';

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
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      return await this.userQueryRepository.userLoginQuery(
        email,
        queryRunner.manager,
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { IdDto } from 'apps/libs/common/dto/id.dto';
import { DataSource } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersQueryService {
  constructor(
    private readonly userQueryRepository: IUsersQueryRepository<ResponseUserDto>,
    private dataSource: DataSource,
  ) {}
  async findUserByIdQuery(id: IdDto): Promise<ResponseUserDto> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      return await this.userQueryRepository.findUserByIdQuery(
        id,
        queryRunner.manager,
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { DataSource } from 'typeorm';
import { IUserCommandRepository } from './interfaces/users-command.interface';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';
import { CreateProfileDto } from 'apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from 'apps/libs/Users/dto/profile/update-profile.dto';
import { IProfileCommandRepository } from './interfaces/profile-command.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    private readonly userCommandRepository: IUserCommandRepository<
      CreateUserDto,
      UpdateUserDto
    >,
    private readonly profileCommandRepository: IProfileCommandRepository<
      CreateProfileDto,
      UpdateProfileDto
    >,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = await this.userCommandRepository.create(
        createUserDto,
        queryRunner.manager,
      );
      const createProfileDto: CreateProfileDto = {
        user,
        username: createUserDto.username,
      };
      await this.profileCommandRepository.create(
        createProfileDto,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException(error);
    } finally {
      await queryRunner.release();
    }
  }
}

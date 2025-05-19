import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { DataSource } from 'typeorm';
import { UpdateUserDto } from '../../../apps/libs/Users/dto/user/update-user.dto';
import { CreateProfileDto } from '../../../apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from '../../../apps/libs/Users/dto/profile/update-profile.dto';
import { IUserCommandRepository } from './interfaces/command/user-command.interface';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { ResponseUserDto } from '../../../apps/libs/Users/dto/user/response-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersCommandService {
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
  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
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
      return plainToInstance(ResponseUserDto, user);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async emailVerify(email: string): Promise<void> {
    const verifyEmailDto = { verified: true };
    const queryRunner = this.dataSource.createQueryRunner();
    const findCriteria = { email: email };
    await this.userCommandRepository.update(
      findCriteria,
      verifyEmailDto,
      queryRunner.manager,
    );
  }
}

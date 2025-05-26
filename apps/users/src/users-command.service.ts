import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../../apps/libs/Users/dto/user/create-user.dto';
import { DataSource, QueryFailedError } from 'typeorm';
import { UpdateUserDto } from '../../../apps/libs/Users/dto/user/update-user.dto';
import { CreateProfileDto } from '../../../apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from '../../../apps/libs/Users/dto/profile/update-profile.dto';
import { IUserCommandRepository } from './interfaces/command/user-command.interface';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { ResponseUserDto } from '../../../apps/libs/Users/dto/user/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserCriteria } from './features/find-by-criteria/query/find-users-by-criteria.query';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { IProviderCommandRepository } from './interfaces/command/provider-command.interface';
import { CreateProviderDto } from 'apps/libs/Users/dto/provider/create-provider.dto';
import { UpdateProviderDto } from 'apps/libs/Users/dto/provider/update-provider.dto';
import { OauthProviders } from 'apps/libs/Users/constants/oauth-providers.enum';

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
    private readonly providerCommandRepository: IProviderCommandRepository<
      CreateProviderDto,
      UpdateProviderDto
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

      Object.keys(OauthProviders).forEach(async (key) => {
        const providerDto: CreateProviderDto = {
          user,
          type: OauthProviders[key],
        };
        await this.providerCommandRepository.create(
          providerDto,
          queryRunner.manager,
        );
      });

      await queryRunner.commitTransaction();
      return plainToInstance(ResponseUserDto, user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if ((error['code'] = '23505')) {
          throw new ConflictException(
            'user with this email/username already exists',
          );
        }
        if ((error['code'] = '23503')) {
          throw new BadRequestException();
        }
      }
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(
    criteria: UpdateUserCriteria,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    const updatedUser = await this.userCommandRepository.update(
      criteria,
      updateUserDto,
      queryRunner.manager,
    );
    if (!updatedUser) throw new NotFoundException();
    return plainToInstance(ResponseUserDto, updatedUser);
  }

  async reCreateNotVerifiedUser(
    criteria: UserCriteria,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    const user = await this.userCommandRepository.update(
      criteria,
      updateUserDto,
      queryRunner.manager,
    );
    return plainToInstance(ResponseUserDto, user);
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

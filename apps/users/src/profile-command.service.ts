import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ResponseProfileDto } from '../../../apps/libs/Users/dto/user/response-profile.dto';
import { plainToInstance } from 'class-transformer';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { CreateProfileDto } from '../../../apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from '../../../apps/libs/Users/dto/profile/update-profile.dto';
import { ProfileUpdateCriteria } from './infrastructure/repository/command/profile-command.repository';
import { IUsersQueryRepository } from './interfaces/query/user-query.interface';
import { User } from './users.resolver';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';

@Injectable()
export class ProfileCommandService {
  constructor(
    private readonly profileCommandRepository: IProfileCommandRepository<
      CreateProfileDto,
      UpdateProfileDto,
      ResponseProfileDto
    >,
    private readonly userQueryRepository: IUsersQueryRepository<
      User,
      ResponseUserDto
    >,
  ) {}

  async create(
    createProfileDto: CreateProfileDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProfileDto> {
    return await this.profileCommandRepository.create(
      createProfileDto,
      entityManager,
    );
  }

  async update(
    criteria: ProfileUpdateCriteria,
    updateProfileDto: UpdateProfileDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProfileDto> {
    const updateProfile = await this.profileCommandRepository.update(
      criteria,
      updateProfileDto,
      entityManager,
    );
    return plainToInstance(ResponseProfileDto, updateProfile);
  }

  async subscribe(subscriber: string, subscribeTo: string): Promise<any> {
    const user = await this.userQueryRepository.findUserByCriteria({
      id: subscriber,
    });

    if (!user)
      throw new NotFoundException(
        'ProfileCommandService error: user was not found',
      );
    const profileTOSubscribeOn =
      await this.profileCommandRepository.findOne(subscribeTo);
    const subscribers = await this.getAllProfileSubscribedOn(user.profile.id);
    return await this.profileCommandRepository.subscribe(
      user.profile.id,
      profileTOSubscribeOn,
    );
  }

  async getAllProfileSubscribedOn(id: string) {
    const subscribers =
      await this.profileCommandRepository.getAllProfileSubscribedOn(id);
  }
}

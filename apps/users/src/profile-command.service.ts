import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ResponseProfileDto } from '../../../apps/libs/Users/dto/user/response-profile.dto';
import { plainToInstance } from 'class-transformer';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { CreateProfileDto } from '../../../apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from '../../../apps/libs/Users/dto/profile/update-profile.dto';
import { ProfileUpdateCriteria } from './infrastructure/repository/command/profile-command.repository';

@Injectable()
export class ProfileCommandService {
  constructor(
    private readonly profileCommandRepository: IProfileCommandRepository<
      CreateProfileDto,
      UpdateProfileDto,
      ResponseProfileDto
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
}

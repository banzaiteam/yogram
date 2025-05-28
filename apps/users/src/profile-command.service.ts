import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ResponseProfileDto } from 'apps/libs/Users/dto/user/response-profile.dto';
import { plainToInstance } from 'class-transformer';
import { IProfileCommandRepository } from './interfaces/command/profile-command.interface';
import { CreateProfileDto } from 'apps/libs/Users/dto/profile/create-profile.dto';
import { UpdateProfileDto } from 'apps/libs/Users/dto/profile/update-profile.dto';

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
    console.log('ProfileCommandService create');
    return await this.profileCommandRepository.create(
      createProfileDto,
      entityManager,
    );
  }

  async update(
    criteria: object,
    updateProfileDto: UpdateProfileDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProfileDto> {
    const user = await this.profileCommandRepository.update(
      criteria,
      updateProfileDto,
      entityManager,
    );
    console.log('🚀 ~ ProfileCommandService ~ user:', user);
    return plainToInstance(ResponseProfileDto, user);
  }
}

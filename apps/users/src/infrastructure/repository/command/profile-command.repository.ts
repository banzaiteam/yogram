import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../libs/common/abstract/base-repository.abstract';
import { CreateUserDto } from '../../../../../libs/Users/dto/user/create-user.dto';
import { UpdateUserDto } from '../../../../../libs/Users/dto/user/update-user.dto';
import { Profile } from '../../entity/Profile.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { IProfileCommandRepository } from 'apps/users/src/interfaces/command/profile-command.interface';
import { ResponseProfileDto } from 'apps/libs/Users/dto/user/response-profile.dto';
import { UpdateProfileDto } from 'apps/libs/Users/dto/profile/update-profile.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProfileCommandRepository
  extends BaseRepository
  implements
    IProfileCommandRepository<CreateUserDto, UpdateUserDto, ResponseProfileDto>
{
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async create(
    createProfileDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<Profile> {
    const profile = new Profile(createProfileDto);
    return this.profileRepository(entityManager).save(profile);
  }

  async update(
    criteria: ProfileUpdateCriteria,
    updateProfileDto: UpdateProfileDto,
    entityManager?: EntityManager,
  ): Promise<ResponseProfileDto> {
    const profile = await this.profileRepository(entityManager)
      .createQueryBuilder('profiles')
      .innerJoin('profiles.user', 'user')
      .where('profiles.id = :id', { id: criteria?.id })
      .orWhere(
        new Brackets((qb) => {
          qb.where('user.id = :userId', { userId: criteria?.userId }).orWhere(
            'user.email = :email',
            {
              email: criteria?.email,
            },
          );
        }),
      )
      .getOne();
    if (!profile) return null;
    this.profileRepository(entityManager).merge(profile, {
      ...updateProfileDto,
    });
    await this.profileRepository(entityManager).save(profile);
    return plainToInstance(ResponseProfileDto, profile);
  }
  delete(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private profileRepository(
    entityManager?: EntityManager,
  ): Repository<Profile> {
    return this.getRepository(Profile, entityManager);
  }
}

export type ProfileUpdateCriteria = {
  id?: string;
  userId?: string;
  email?: string;
};

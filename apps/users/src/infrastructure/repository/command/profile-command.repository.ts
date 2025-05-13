import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../libs/common/abstract/base-repository.abstract';
import { CreateUserDto } from '../../../../../libs/Users/dto/user/create-user.dto';
import { UpdateUserDto } from '../../../../../libs/Users/dto/user/update-user.dto';
import { Profile } from '../../entity/Profile.entity';
import { EntityManager, Repository } from 'typeorm';
import { IProfileCommandRepository } from 'apps/users/src/interfaces/command/profile-command.interface';

@Injectable()
export class ProfileCommandRepository
  extends BaseRepository
  implements IProfileCommandRepository<CreateUserDto, UpdateUserDto>
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

  update(updateProfileDto: UpdateUserDto): Promise<Profile> {
    throw new Error('Method not implemented.');
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

import { EntityManager } from 'typeorm';
import { ProfileUpdateCriteria } from '../../infrastructure/repository/command/profile-command.repository';
import { Profile } from '../../infrastructure/entity/Profile.entity';
import { ResponseProfile1Dto } from 'apps/libs/Users/dto/user/response-profile.dto';

export abstract class IProfileCommandRepository<C, U, R> {
  abstract create(
    createProfileDto: C,
    entityManager?: EntityManager,
  ): Promise<R>;
  abstract update(
    criteria: ProfileUpdateCriteria,
    updateProfileDto: U,
    entityManager?: EntityManager,
  ): Promise<R>;
  abstract delete(userId: string): Promise<void>;

  abstract findOne(id: string): Promise<ResponseProfile1Dto>;
}

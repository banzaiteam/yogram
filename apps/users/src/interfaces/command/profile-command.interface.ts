import { EntityManager } from 'typeorm';
import { ProfileUpdateCriteria } from '../../infrastructure/repository/command/profile-command.repository';
import { Profile } from '../../infrastructure/entity/Profile.entity';

export abstract class IProfileCommandRepository<C, U, R> {
  abstract getAllProfileSubscribedOn(id: string);
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

  abstract subscribe(
    subscriber: string,
    subscribeTo: Profile,
    entityManager?: EntityManager,
  ): Promise<any>;

  abstract findOne(id: string): Promise<Profile>;
}

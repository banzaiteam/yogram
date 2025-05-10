import { EntityManager } from 'typeorm';
import { Profile } from '../infrastructure/entity/User.entity';

export abstract class IProfileCommandRepository<C, U> {
  abstract create(
    createProfileDto: C,
    entityManager?: EntityManager,
  ): Promise<Profile>;
  abstract update(updateProfileDto: U): Promise<Profile>;
  abstract delete(userId: string): Promise<void>;
}

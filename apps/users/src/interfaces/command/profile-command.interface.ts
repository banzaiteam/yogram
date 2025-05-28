import { EntityManager } from 'typeorm';
import { ProfileUpdateCriteria } from '../../infrastructure/repository/command/profile-command.repository';

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
}

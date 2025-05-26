import { DeepPartial, EntityManager } from 'typeorm';
import { User } from '../../infrastructure/entity/User.entity';

export abstract class IUserCommandRepository<C, U> {
  abstract create(
    createUserDto: DeepPartial<C>,
    entityManager?: EntityManager,
  ): Promise<User>;
  abstract update(
    criteria: object,
    updateUserDto: U,
    entityManager?: EntityManager,
  ): Promise<User>;
  abstract delete(userId: string): Promise<void>;
}

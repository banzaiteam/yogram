import { EntityManager } from 'typeorm';
import { User } from '../../infrastructure/entity/User.entity';

export abstract class IUserCommandRepository<C, U> {
  abstract create(
    createUserDto: C,
    entityManager?: EntityManager,
  ): Promise<User>;
  abstract update(updateUserDto: U): Promise<User>;
  abstract delete(userId: string): Promise<void>;
}

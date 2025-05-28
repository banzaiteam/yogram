import { DeepPartial, EntityManager } from 'typeorm';
import { User } from '../../infrastructure/entity/User.entity';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';

export abstract class IUserCommandRepository<C, U> {
  abstract create(
    createUserDto: DeepPartial<C>,
    entityManager?: EntityManager,
  ): Promise<User>;
  abstract update(
    criteria: UpdateUserCriteria,
    updateUserDto: U,
    entityManager?: EntityManager,
  ): Promise<User>;
  abstract delete(userId: string): Promise<void>;
}

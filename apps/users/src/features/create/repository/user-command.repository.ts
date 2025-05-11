import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../../apps/libs/common/abstract/base-repository.abstract';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';
import { User } from '../../../../../../apps/users/src/infrastructure/entity/User.entity';
import { IUserCommandRepository } from 'apps/users/src/interfaces/users-command.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserCommandRepository
  extends BaseRepository
  implements IUserCommandRepository<CreateUserDto, UpdateUserDto>
{
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async create(
    createUserDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    const user = new User(createUserDto);
    return this.userRepository(entityManager).save(user);
  }
  update(updateUserDto: UpdateUserDto): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}

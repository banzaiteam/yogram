import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../../apps/libs/common/abstract/base-repository.abstract';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';
import { User } from '../../../../../../apps/users/src/infrastructure/entity/User.entity';
import { EntityManager, Repository } from 'typeorm';
import { IUserCommandRepository } from 'apps/users/src/interfaces/command/user-command.interface';

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
    return await this.userRepository(entityManager).save(user);
  }
  async update(
    criteria: object,
    updateUserDto: UpdateUserDto,
    entityManager?: EntityManager,
  ): Promise<void> {
    const updated = await this.userRepository(entityManager).update(
      criteria,
      updateUserDto,
    );
    if (updated.affected < 1)
      throw new BadRequestException(`some user property was not updated`);
  }
  delete(userId: string, entityManager?: EntityManager): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}

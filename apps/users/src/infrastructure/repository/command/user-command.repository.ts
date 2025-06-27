import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';
import { UpdateUserDto } from 'apps/libs/Users/dto/user/update-user.dto';
import { User } from '../../../../../../apps/users/src/infrastructure/entity/User.entity';
import { EntityManager, Repository } from 'typeorm';
import { IUserCommandRepository } from 'apps/users/src/interfaces/command/user-command.interface';
import { UpdateUserCriteria } from 'apps/libs/Users/dto/user/update-user-criteria.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserCommandRepository
  implements IUserCommandRepository<CreateUserDto, UpdateUserDto>
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  // We pass the entity manager into getRepository to ensure that we
  // we run the query in the same context as the transaction.
  async create(
    createUserDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    const user = new User({ id: createUserDto.id, ...createUserDto });
    if (entityManager) {
      return await entityManager.save(user);
    }
    return await this.userRepository.save(user);
  }

  async update(
    criteria: UpdateUserCriteria, // id | email | username
    updateUserDto: UpdateUserDto,
    entityManager?: EntityManager,
  ): Promise<User> {
    console.log('🚀 ~ updateUserDto:', updateUserDto);
    const user = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.profile', 'profile')
      .innerJoinAndSelect('users.providers', 'provider')
      .where('profile.username = :username', { username: criteria?.username })
      .orWhere('users.id = :id', { id: criteria?.id })
      .orWhere('users.email = :email', { email: criteria?.email })
      .getOne();

    if (!user) throw new NotFoundException();
    const providers = user.providers.filter((provider) => {
      if (provider.providerId !== null) {
        const keys = Object.keys(provider);
        for (let key of keys) {
          if (updateUserDto.hasOwnProperty(key)) {
            provider[key] = updateUserDto[key];
          }
        }
        return provider;
      }
    });

    this.userRepository.merge(user, {
      ...updateUserDto,
      profile: { ...updateUserDto },
      providers,
    });
    if (entityManager) {
      return await entityManager.save(user);
    }
    return await this.userRepository.save(user);
  }

  delete(userId: string, entityManager?: EntityManager): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

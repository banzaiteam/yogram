import { BaseRepository } from '../../../../../../apps/libs/common/abstract/base-repository.abstract';
import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from '../../../../../../apps/users/src/interfaces/query/user-query.interface';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entity/User.entity';
import { plainToInstance } from 'class-transformer';
import { UserCriteria } from '../../../../../../apps/users/src/features/find-by-criteria/query/find-users-by-criteria.query';
import { ResponseLoginDto } from '../../../../../../apps/libs/Users/dto/user/response-login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class UserQueryRepository
  extends BaseRepository
  implements IUsersQueryRepository<ResponseLoginDto, ResponseUserDto>
{
  async userLoginQuery(
    email: string,
    entityManager?: EntityManager,
  ): Promise<ResponseLoginDto | null> {
    const user = await this.userRepository(entityManager).findOneBy({
      email,
    });
    if (!user) throw new NotFoundException();
    if (!user.verified)
      throw new UnauthorizedException('account is not verified');
    return plainToInstance(ResponseLoginDto, user);
  }

  // find only by userId or email, or username or provider
  async findUserByCriteria(
    criteria: UserCriteria,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userRepository(entityManager)
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.profile', 'profile')
      .innerJoinAndSelect('users.providers', 'provider')
      .where('profile.username = :username', { username: criteria?.username })
      .orWhere('users.email = :email', { email: criteria?.email })
      .orWhere('users.id = :id', { id: criteria?.id })
      .orWhere('provider.providerId = :providerId', {
        providerId: criteria?.providerId,
      })
      .getOne();
    // const user = await this.userRepository(entityManager).find(criteria))[0]
    console.log('🚀 ~ user:', user);
    if (!user) return null;
    const mappedUser = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      username: user.profile.username,
      providers: user.providers,
      profile: user.profile,
    };
    return plainToInstance(ResponseUserDto, mappedUser);
  }

  async findUserByUsername(
    username: string,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userRepository(entityManager)
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.profile', 'profile')
      .where('profile.username = :username', { username })
      .getOne();
    if (!user) return null;
    const mappedUser = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      username: user.profile.username,
      providers: user.providers,
    };
    return plainToInstance(ResponseUserDto, mappedUser);
  }

  async findUserByProviderId(
    providerId: string,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userRepository(entityManager)
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.providers', 'provider')
      .innerJoinAndSelect('users.profile', 'profile')
      .where('provider.providerId = :providerId', { providerId })
      .getOne();
    if (!user) return null;
    console.log('🚀 ~ user:', user);
    const mappedUser = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      username: user.profile.username,
      providers: user.providers,
    };
    console.log('🚀 ~ mappedUser:', mappedUser);
    return plainToInstance(ResponseUserDto, mappedUser);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}

import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from '../../../../../../apps/users/src/interfaces/query/user-query.interface';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entity/User.entity';
import { plainToInstance } from 'class-transformer';
import { UserCriteria } from '../../../../../../apps/users/src/features/find-by-criteria/query/find-users-by-criteria.query';
import { ResponseLoginDto } from '../../../../../../apps/libs/Users/dto/user/response-login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export class UserQueryRepository
  implements IUsersQueryRepository<ResponseLoginDto, ResponseUserDto>
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async userLoginQuery(email: string): Promise<ResponseLoginDto | null> {
    const user = await this.usersRepository.findOneBy({
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
  ): Promise<ResponseUserDto | null> {
    const user = await this.usersRepository
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
    if (!user) return null;
    const mappedUser = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      url: user.url,
      username: user.profile.username,
      providers: user.providers,
      profile: user.profile,
    };
    return plainToInstance(ResponseUserDto, mappedUser);
  }

  async findUserByUsername(username: string): Promise<ResponseUserDto | null> {
    const user = await this.usersRepository
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
  ): Promise<ResponseUserDto | null> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.providers', 'provider')
      .innerJoinAndSelect('users.profile', 'profile')
      .where('provider.providerId = :providerId', { providerId })
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
}

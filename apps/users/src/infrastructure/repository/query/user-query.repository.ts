import { BaseRepository } from '../../../../../../apps/libs/common/abstract/base-repository.abstract';
import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from '../../../../../../apps/users/src/interfaces/query/user-query.interface';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entity/User.entity';
import { plainToInstance } from 'class-transformer';
import { UserCriteria } from 'apps/users/src/features/find-by-criteria/query/find-users-by-criteria.query';
import { ResponseLoginDto } from 'apps/libs/Users/dto/user/response-login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class UserQueryRepository
  extends BaseRepository
  implements IUsersQueryRepository<ResponseLoginDto, ResponseUserDto>
{
  async userLoginQuery(
    email: string,
    entityManager?: EntityManager,
  ): Promise<ResponseLoginDto> {
    const user = await this.userRepository(entityManager).findOneBy({
      email,
    });
    if (!user) throw new NotFoundException();
    if (!user.verified)
      throw new UnauthorizedException('account is not verified');
    return plainToInstance(ResponseLoginDto, user);
  }

  async findUserByCriteria(
    criteria: UserCriteria,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto> {
    const user = (
      await this.userRepository(entityManager).find({
        where: criteria,
      })
    )[0];
    if (!user) throw new NotFoundException();
    const mappedUser = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      username: user.profile.username,
    };
    return plainToInstance(ResponseUserDto, mappedUser);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}

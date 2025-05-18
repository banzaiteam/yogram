import { BaseRepository } from '../../../../../../apps/libs/common/abstract/base-repository.abstract';
import { ResponseUserDto } from '../../../../../../apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from '../../../../../../apps/users/src/interfaces/query/user-query.interface';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entity/User.entity';
import { plainToInstance } from 'class-transformer';
import { IdDto } from '../../../../../../apps/libs/common/dto/id.dto';
import { UserProfileCriteria } from 'apps/users/src/features/find-by-criteria/query/find-users-by-criteria.query';

export class UserQueryRepository
  extends BaseRepository
  implements IUsersQueryRepository<ResponseUserDto>
{
  async findUserByIdQuery(
    id: IdDto,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto> {
    const user = this.userRepository(entityManager).findOneByOrFail(id);
    return plainToInstance(ResponseUserDto, user);
  }

  async findUserByCriteria(
    criteria: UserProfileCriteria,
    entityManager?: EntityManager,
  ): Promise<ResponseUserDto> {
    const user =
      await this.userRepository(entityManager).findOneByOrFail(criteria);
    console.log('🚀 ~ user:', user);
    return plainToInstance(ResponseUserDto, user);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}

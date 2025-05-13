import { BaseRepository } from 'apps/libs/common/abstract/base-repository.abstract';
import { ReponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { IUsersQueryRepository } from 'apps/users/src/interfaces/query/user-query.interface';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../../entity/User.entity';
import { plainToInstance } from 'class-transformer';

export class UserQueryRepository
  extends BaseRepository
  implements IUsersQueryRepository<ReponseUserDto>
{
  async findOne(id: string): Promise<ReponseUserDto> {
    const user = await this.userRepository().findOneByOrFail({ id });
    return plainToInstance(ReponseUserDto, user);
  }

  private userRepository(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }
}

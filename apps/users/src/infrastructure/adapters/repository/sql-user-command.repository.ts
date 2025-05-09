import { SqlCommandBaseRepository } from 'apps/libs/common/abstract/sql-command-base-repository.abstract';
import { UserModel } from 'apps/users/src/domain/models/User.model';
import { User } from '../../entity/User.entity';
import { DataSource } from 'typeorm';

export class SqlUserCommandRepository extends SqlCommandBaseRepository<
  UserModel,
  User
> {
  constructor(
    private dataSource: DataSource,
    private modelUserFactory: UserModelEntityFactory,
  ) {
    super(dataSource.getRepository(User), modelUserFactory);
  }
}

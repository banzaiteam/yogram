import { Provider } from '@nestjs/common';
import { IUsersQueryRepository } from '../../interfaces/query/user-query.interface';
import { UserQueryRepository } from '../../infrastructure/repository/query/user-query.repository';

export const UsersQueryRepositoryProvider: Provider = {
  provide: IUsersQueryRepository,
  useClass: UserQueryRepository,
};

import { Provider } from '@nestjs/common';
import { IUserCommandRepository } from '../interfaces/users-command.interface';
import { UserCommandRepository } from '../features/create/repository/user-command.repository';

export const UserRepositoryProvider: Provider = {
  provide: IUserCommandRepository,
  useClass: UserCommandRepository,
};

import { Provider } from '@nestjs/common';
import { UserCommandRepository } from '../../infrastructure/repository/command/user-command.repository';
import { IUserCommandRepository } from '../../interfaces/command/user-command.interface';

export const UserCommandRepositoryProvider: Provider = {
  provide: IUserCommandRepository,
  useClass: UserCommandRepository,
};

import { Provider } from '@nestjs/common';
import { ProfileCommandRepository } from '../features/create/repository/profile-command.repository';
import { IProfileCommandRepository } from '../interfaces/profile-command.interface';

export const ProfileRepositoryProvider: Provider = {
  provide: IProfileCommandRepository,
  useClass: ProfileCommandRepository,
};

import { Provider } from '@nestjs/common';
import { IProfileCommandRepository } from '../interfaces/profile-command.interface';
import { ProfileCommandRepository } from '../infrastructure/repository/profile-command.repository';

export const ProfileRepositoryProvider: Provider = {
  provide: IProfileCommandRepository,
  useClass: ProfileCommandRepository,
};

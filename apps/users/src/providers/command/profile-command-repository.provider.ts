import { Provider } from '@nestjs/common';
import { ProfileCommandRepository } from '../../infrastructure/repository/command/profile-command.repository';
import { IProfileCommandRepository } from '../../interfaces/command/profile-command.interface';

export const ProfileCommandRepositoryProvider: Provider = {
  provide: IProfileCommandRepository,
  useClass: ProfileCommandRepository,
};

import { Provider } from '@nestjs/common';
import { IProviderCommandRepository } from '../../interfaces/command/provider-command.interface';
import { ProviderCommandRepository } from '../../infrastructure/repository/command/provider-command.repository';

export const ProviderCommandRepositoryProvider: Provider = {
  provide: IProviderCommandRepository,
  useClass: ProviderCommandRepository,
};

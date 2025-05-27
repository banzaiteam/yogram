import { Provider } from '@nestjs/common';
import { IProviderQueryRepository } from '../../interfaces/query/provider-query.interface';
import { ProviderQueryRepository } from '../../infrastructure/repository/query/provider-query.repository';

export const ProviderQueryRepositoryProvider: Provider = {
  provide: IProviderQueryRepository,
  useClass: ProviderQueryRepository,
};

import { Provider } from '@nestjs/common';
import { ISubscriberQueryRepository } from '../../interfaces/query/subscriber-query.interface';
import { SubscriberQueryRepository } from '../../infrastructure/repository/query/subscriber-query.repository';

export const SubscriberQueryRepositoryProvider: Provider = {
  provide: ISubscriberQueryRepository,
  useClass: SubscriberQueryRepository,
};

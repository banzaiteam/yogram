import { Provider } from '@nestjs/common';
import { SubscriberCommandRepository } from '../../infrastructure/repository/command/subscriber-command.repository';
import { ISubscriberCommandRepository } from '../../interfaces/command/subscriber-command.interface';

export const SubscriberCommandRepositoryProvider: Provider = {
  provide: ISubscriberCommandRepository,
  useClass: SubscriberCommandRepository,
};

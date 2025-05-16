import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendVerifyEmailEvent } from './send-verify-email.event';
import { ProducerService } from 'apps/libs/common/message-brokers/rabbit/providers/producer.service';
import { UsersRoutingKeys } from 'apps/users/src/message-brokers/rabbit/users-routing-keys.constant';

@EventsHandler(SendVerifyEmailEvent)
export class SendVerifyEmailHandler
  implements IEventHandler<SendVerifyEmailEvent>
{
  constructor(private readonly producerService: ProducerService) {}

  async handle({ userVerifyEmailDto }: SendVerifyEmailEvent) {
    await this.producerService.emit({
      routingKey: UsersRoutingKeys.UsersVerifyEmail,
      payload: userVerifyEmailDto,
    });
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeDto } from '../../../../../../apps/libs/Users/dto/subscriber/subscribe.dto';
import { SubscriberCommandService } from '../../../../../../apps/users/src/subscriber-command.service';

export class SubscribeCommand {
  constructor(public readonly subscribeDto: SubscribeDto) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeHandler implements ICommandHandler<SubscribeCommand> {
  constructor(
    private readonly subscriberCommandService: SubscriberCommandService,
  ) {}

  async execute({ subscribeDto }: SubscribeCommand): Promise<void> {
    const { subscriber, subscribeTo } = subscribeDto;
    await this.subscriberCommandService.subscribe(subscriber, subscribeTo);
  }
}

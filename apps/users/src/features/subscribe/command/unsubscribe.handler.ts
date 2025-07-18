import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriberCommandService } from '../../../../../../apps/users/src/subscriber-command.service';
import { UnsubscribeDto } from '../../../../../../apps/libs/Users/dto/subscriber/unsubscribe.dto';

export class UnsubscribeCommand {
  constructor(public readonly unsubscribeDto: UnsubscribeDto) {}
}

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeHandler implements ICommandHandler<UnsubscribeCommand> {
  constructor(
    private readonly subscriberCommandService: SubscriberCommandService,
  ) {}

  async execute({ unsubscribeDto }: UnsubscribeCommand): Promise<void> {
    const { subscriber, unsubscribeFrom } = unsubscribeDto;
    await this.subscriberCommandService.unsubscribe(
      subscriber,
      unsubscribeFrom,
    );
  }
}

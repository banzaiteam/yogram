import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeDto } from 'apps/libs/Users/dto/profile/subscribe.dto';
import { ProfileCommandService } from 'apps/users/src/profile-command.service';

export class SubscribeCommand {
  constructor(public readonly subscribeDto: SubscribeDto) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeHandler implements ICommandHandler<SubscribeCommand> {
  constructor(private readonly profileCommandService: ProfileCommandService) {}

  async execute({ subscribeDto }: SubscribeCommand): Promise<any> {
    const { subscriber, subscribeTo } = subscribeDto;
    return await this.profileCommandService.subscribe(subscriber, subscribeTo);
  }
}

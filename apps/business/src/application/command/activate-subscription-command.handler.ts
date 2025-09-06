import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';

export class ActivateSubscriptionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(ActivateSubscriptionCommand)
export class ActivateSubscriptionHandler
  implements ICommandHandler<ActivateSubscriptionCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({ id }: ActivateSubscriptionCommand): Promise<any> {
    return await this.businessCommandService.activateSubscription(id);
  }
}

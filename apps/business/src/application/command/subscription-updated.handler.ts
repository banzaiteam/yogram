import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';

export class SubscriptionUpdatedCommand {
  constructor(public readonly subscriptionId: string) {}
}

@CommandHandler(SubscriptionUpdatedCommand)
export class SubscriptionUpdatedHandler
  implements ICommandHandler<SubscriptionUpdatedCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}
  async execute({ subscriptionId }: SubscriptionUpdatedCommand): Promise<any> {
    return await this.businessCommandService.updateSubscription(
      subscriptionId,
      {},
    );
  }
}

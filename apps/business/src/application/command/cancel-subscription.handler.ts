import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';

export class CancelSubscriptionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionHandler
  implements ICommandHandler<CancelSubscriptionCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({ id }: CancelSubscriptionCommand): Promise<any> {
    return await this.businessCommandService.cancelSubscription(id);
  }
}

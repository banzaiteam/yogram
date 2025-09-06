import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';

export class SuspendSubscriptionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(SuspendSubscriptionCommand)
export class SuspendSubscriptionHandler
  implements ICommandHandler<SuspendSubscriptionCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({ id }: SuspendSubscriptionCommand): Promise<any> {
    return await this.businessCommandService.suspendSubscription(id);
  }
}

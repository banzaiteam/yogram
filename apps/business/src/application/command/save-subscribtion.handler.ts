import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';

export class SaveSubscriptionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(SaveSubscriptionCommand)
export class SaveSubscriptionHandler
  implements ICommandHandler<SaveSubscriptionCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({ id }: SaveSubscriptionCommand): Promise<any> {
    return await this.businessCommandService.saveSubscription(id);
  }
}

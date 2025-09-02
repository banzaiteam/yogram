import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';
import { SaveSubscriptionDto } from '../../payment/payment-services/paypal/dto/save-subscription.dto';

export class SaveSubscriptionCommand {
  constructor(public readonly saveSubscriptionDto: SaveSubscriptionDto) {}
}

@CommandHandler(SaveSubscriptionCommand)
export class SaveSubscriptionHandler
  implements ICommandHandler<SaveSubscriptionCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({
    saveSubscriptionDto,
  }: SaveSubscriptionCommand): Promise<any> {
    return await this.businessCommandService.saveSubscription(
      saveSubscriptionDto,
    );
  }
}

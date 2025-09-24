import { SubscriptionStatus } from '../../payment/payment-services/paypal/constants/subscription-status.enum';
import { Subscription } from '../../infrastructure/entity/subscription.entity';
import { BusinessCommandService } from '../../business-command.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class SubscriptionExpiredCommand {
  constructor(public readonly subscriptionId: string) {}
}

@CommandHandler(SubscriptionExpiredCommand)
export class SubscriptionExpiredHandler
  implements ICommandHandler<SubscriptionExpiredCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}
  async execute({
    subscriptionId,
  }: SubscriptionExpiredCommand): Promise<Subscription> {
    const status = SubscriptionStatus.Inactive;
    return await this.businessCommandService.editSubscriptionStatus(
      subscriptionId,
      status,
    );
  }
}

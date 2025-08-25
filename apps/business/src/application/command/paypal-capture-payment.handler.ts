import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';

export class PayPalCapturePaymentCommand {
  constructor(public readonly token: string) {}
}

@CommandHandler(PayPalCapturePaymentCommand)
export class PayPalCapturePaymentHandler
  implements ICommandHandler<PayPalCapturePaymentCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({ token }: PayPalCapturePaymentCommand): Promise<string> {
    return await this.businessCommandService.capturePayment(token);
  }
}

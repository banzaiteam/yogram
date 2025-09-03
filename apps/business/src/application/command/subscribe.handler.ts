import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BusinessCommandService } from '../../business-command.service';
import { SubscribeDto } from '../../../../libs/Business/dto/input/subscribe.dto';

export class SubscribeCommand {
  constructor(public readonly subscribeDto: SubscribeDto) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeHandler implements ICommandHandler<SubscribeCommand> {
  constructor(private readonly businessService: BusinessCommandService) {}

  async execute({ subscribeDto }: SubscribeCommand): Promise<string> {
    return await this.businessService.subscribe(subscribeDto);
  }
}

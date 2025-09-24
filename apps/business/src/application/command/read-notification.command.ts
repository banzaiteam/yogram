import { BusinessCommandService } from '../../business-command.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ReadNotificationCommand {
  constructor(public readonly notificationId: string) {}
}

@CommandHandler(ReadNotificationCommand)
export class ReadNotificationHandler
  implements ICommandHandler<ReadNotificationCommand>
{
  constructor(
    private readonly businessCommandService: BusinessCommandService,
  ) {}

  async execute({ notificationId }: ReadNotificationCommand): Promise<any> {
    return await this.businessCommandService.updateNotification(notificationId);
  }
}

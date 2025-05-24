import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendUserVerifyEmailCommand } from '../features/verifyEmail/command/send-user-verify-email.command';
import { UsersRoutingKeys } from '../../../../apps/users/src/message-brokers/rabbit/users-routing-keys.constant';
import { EventSubscribe } from '../../../../apps/libs/common/message-brokers/rabbit/decorators/event-subscriber.decorator';
import { IEvent } from '../../../../apps/libs/common/message-brokers/interfaces/event.interface';
import { MailerRoutingKeysEnum } from 'apps/libs/Mailer/constants';
import { SendEmailCommand } from '../features/sendEmail/command/send-email.command';

@Controller()
export class MailerController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventSubscribe({ routingKey: UsersRoutingKeys.UsersVerifyEmail })
  async sendUserVerifyEmail(rtKey: string, { payload }: IEvent): Promise<void> {
    const { to, username } = payload;
    await this.commandBus.execute(
      new SendUserVerifyEmailCommand({ to, username }),
    );
  }

  @EventSubscribe({ routingKey: MailerRoutingKeysEnum.SendEmail })
  async sendEmail(rtKey: string, { payload }: IEvent): Promise<void> {
    await this.commandBus.execute(new SendEmailCommand(payload));
  }
}

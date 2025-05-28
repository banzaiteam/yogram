import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from './send-email.command';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  constructor(private readonly mailerService: MailerService) {}
  async execute({ payload }: SendEmailCommand): Promise<any> {
    try {
      const result = await this.mailerService.sendMail({
        to: payload.to,
        subject: payload.subject,
        html: payload.template,
      });
      return result.envelope;
    } catch (err) {
      console.log(err);
      throw new RpcException(`${payload.subject} email was not sent; ${err}`);
    }
  }
}

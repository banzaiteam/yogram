import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendUserVerifyEmailCommand } from './send-user-verify-email.command';
import { MailService } from 'apps/mailer/src/mailer.service';

@CommandHandler(SendUserVerifyEmailCommand)
export class SendUserVerifyEmailHandler
  implements ICommandHandler<SendUserVerifyEmailCommand>
{
  constructor(private readonly mailService: MailService) {}
  async execute({
    userVerifyEmailDto,
  }: SendUserVerifyEmailCommand): Promise<any> {
    await this.mailService.sendUserVerifyEmail(userVerifyEmailDto);
  }
}

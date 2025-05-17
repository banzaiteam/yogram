import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailVerifyCommand } from './email-verify.command';
import { UsersCommandService } from '../../users-command.service';

@CommandHandler(EmailVerifyCommand)
export class EmailVerifyHandler implements ICommandHandler<EmailVerifyCommand> {
  constructor(private readonly usersCommandService: UsersCommandService) {}

  async execute({ email }: EmailVerifyCommand): Promise<void> {
    await this.usersCommandService.emailVerify(email);
  }
}

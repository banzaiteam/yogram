import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UsersCommandService } from '../../../users-command.service';
import { UserVerifyEmailDto } from 'apps/libs/Users/dto/user/user-verify-email.dto';
import { SendVerifyEmailEvent } from '../event/send-verify-email.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ createUserDto }: CreateUserCommand): Promise<void> {
    const user = await this.usersCommandService.createUser(createUserDto);
    const userVerifyEmailDto: UserVerifyEmailDto = {
      to: user.email,
      username: user.username,
    };
    await this.eventBus.publish(new SendVerifyEmailEvent(userVerifyEmailDto));
  }
}

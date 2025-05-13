import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UsersCommandService } from '../../../users-command.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersCommandService: UsersCommandService) {}

  async execute({ createUserDto }: CreateUserCommand): Promise<void> {
    await this.usersCommandService.createUser(createUserDto);
  }
}

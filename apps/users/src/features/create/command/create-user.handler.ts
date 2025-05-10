import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UsersService } from 'apps/users/src/users.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute({ createUserDto }: CreateUserCommand): Promise<any> {
    await this.usersService.createUser(createUserDto);
  }
}

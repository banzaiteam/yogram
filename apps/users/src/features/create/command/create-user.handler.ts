import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserModelFactory } from 'apps/users/src/domain/factory/user-model.factory';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userModelFactory: UserModelFactory) {}

  execute({ createUserDto }: CreateUserCommand): Promise<any> {
    const userModel = this.userModelFactory.create(createUserDto);
  }
}

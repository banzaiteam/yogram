import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UsersCommandService } from '../../../users-command.service';
import { UserVerifyEmailDto } from '../../../../../../apps/libs/Users/dto/user/user-verify-email.dto';
import { SendVerifyEmailEvent } from '../event/send-verify-email.event';
import { UsersQueryService } from '../../../../../../apps/users/src/users-query.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ createUserDto, file }: CreateUserCommand): Promise<void> {
    let userVerifyEmailDto: UserVerifyEmailDto;
    const createUser = await this.usersQueryService.findUserByCriteria({
      email: createUserDto.email,
    });
    // if user already exists but he is not verified(maybe he didnt get email verif. message or want to recreate acc with other credentials)
    if (createUser && !createUser.verified) {
      const criteria = { email: createUserDto.email };
      delete createUserDto.id;
      const user = await this.usersCommandService.updateUser(
        criteria,
        createUserDto,
      );
      userVerifyEmailDto = {
        to: user.email,
        username: user.username,
      };
    } else {
      const user = await this.usersCommandService.createUser(
        createUserDto,
        file,
      );
      userVerifyEmailDto = {
        to: user.email,
        username: user.username,
      };
    }
    await this.eventBus.publish(new SendVerifyEmailEvent(userVerifyEmailDto));
  }
}

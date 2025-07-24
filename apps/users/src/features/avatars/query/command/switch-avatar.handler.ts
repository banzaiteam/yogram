import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SwitchAvatarDto } from '../../../../../../../apps/libs/Users/dto/user/switch-avatar.dto';
import { UsersCommandService } from '../../../../../../../apps/users/src/users-command.service';

export class SwitchAvatarCommand {
  constructor(public readonly switchAvatarDto: SwitchAvatarDto) {}
}

@CommandHandler(SwitchAvatarCommand)
export class SwitchAvatarHandler
  implements ICommandHandler<SwitchAvatarCommand>
{
  constructor(private readonly usersCommandService: UsersCommandService) {}
  async execute({ switchAvatarDto }: SwitchAvatarCommand): Promise<void> {
    return await this.usersCommandService.switchAvatar(switchAvatarDto);
  }
}

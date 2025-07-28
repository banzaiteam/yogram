import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAvatarDto } from '../../../../../../apps/libs/Users/dto/user/delete-avatar.dto';
import { UsersCommandService } from '../../../../../../apps/users/src/users-command.service';

export class DeleteAvatarCommand {
  constructor(public readonly deleteAvatarDto: DeleteAvatarDto) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(private readonly usersService: UsersCommandService) {}
  async execute({ deleteAvatarDto }: DeleteAvatarCommand): Promise<void> {
    return await this.usersService.deleteAvatar(deleteAvatarDto);
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserByCriteriaCommand } from './update-user-by-criteria.command';
import { UsersCommandService } from 'apps/users/src/users-command.service';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(UpdateUserByCriteriaCommand)
export class UpdateUserByCriteriaHandler
  implements ICommandHandler<UpdateUserByCriteriaCommand>
{
  constructor(private readonly usersCommandService: UsersCommandService) {}
  async execute({
    criteria,
    updateUserDto,
  }: UpdateUserByCriteriaCommand): Promise<void> {
    const updatedUser = await this.usersCommandService.updateUser(
      criteria,
      updateUserDto,
    );
    if (!updatedUser)
      throw new InternalServerErrorException('user was not updated');
  }
}

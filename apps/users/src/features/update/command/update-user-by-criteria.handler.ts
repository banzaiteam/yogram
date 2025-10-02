import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserByCriteriaCommand } from './update-user-by-criteria.command';
import { UsersCommandService } from '../../../../../../apps/users/src/users-command.service';
import { InternalServerErrorException } from '@nestjs/common';
import { ResponseUserDto } from 'apps/libs/Users/dto/user/response-user.dto';
import { ConfigService } from '@nestjs/config';
import { AwsBuckets } from 'apps/libs/Files/constants/aws-buckets.constant';

@CommandHandler(UpdateUserByCriteriaCommand)
export class UpdateUserByCriteriaHandler
  implements ICommandHandler<UpdateUserByCriteriaCommand>
{
  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly configService: ConfigService,
  ) {}
  async execute({
    criteria,
    updateUserDto,
    file,
  }: UpdateUserByCriteriaCommand): Promise<ResponseUserDto> {
    console.log(
      '🚀 ~ UpdateUserByCriteriaHandler ~ execute ~ updateUserDto:',
      updateUserDto,
    );
    const updatedUser = await this.usersCommandService.updateUser(
      criteria,
      updateUserDto,
      AwsBuckets.Files,
      file,
    );
    if (!updatedUser)
      throw new InternalServerErrorException('user was not updated');
    return updatedUser;
  }
}

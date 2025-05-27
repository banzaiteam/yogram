import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserGoogleCommand } from './create-user-google.command';
import { UsersCommandService } from 'apps/users/src/users-command.service';

@CommandHandler(CreateUserGoogleCommand)
export class CreateUserGoogleHandler
  implements ICommandHandler<CreateUserGoogleCommand>
{
  constructor(private readonly usersCommandService: UsersCommandService) {}
  async execute({
    googleSignupDto,
    res,
  }: CreateUserGoogleCommand): Promise<any> {
    console.log('googleSignupDtoHandler', res);
    return await this.usersCommandService.createUserGoogle(
      googleSignupDto,
      res,
    );
  }
}

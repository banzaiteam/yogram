import { CreateUserDto } from 'apps/libs/Users/dto/user/create-user.dto';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

import { CreateUserDto } from 'apps/libs/Users/dto/create-user.dto';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

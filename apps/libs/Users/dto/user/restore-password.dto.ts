import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class RestorePasswordDto extends PartialType(
  PickType(CreateUserDto, ['email', 'password']),
) {}

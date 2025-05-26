import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class CreateUserByProviderDto extends OmitType(CreateUserDto, [
  'password',
]) {}

import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean } from 'class-validator';

export class CreateUserByProviderDto extends OmitType(CreateUserDto, [
  'password',
]) {
  @IsBoolean()
  verified: boolean;
}

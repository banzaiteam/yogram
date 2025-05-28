import { PickType } from '@nestjs/swagger';
import { ResponseUserDto } from './response-user.dto';

export class MergeProviderUserDto extends PickType(ResponseUserDto, [
  'id',
  'email',
  'username',
]) {}

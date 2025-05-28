import { OmitType } from '@nestjs/swagger';
import { ResponseLoginDto } from './response-login.dto';
import { Exclude } from 'class-transformer';
import { ResponseProviderDto } from '../provider/response-provider.dto';

export class LoggedUserDto extends OmitType(ResponseLoginDto, ['password']) {
  @Exclude()
  providers: ResponseProviderDto[];
}

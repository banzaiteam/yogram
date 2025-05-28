import { OmitType } from '@nestjs/swagger';
import { ResponseLoginDto } from './response-login.dto';

export class LoggedUserDto extends OmitType(ResponseLoginDto, ['password']) {}

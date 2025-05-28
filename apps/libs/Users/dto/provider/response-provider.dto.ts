import { OmitType } from '@nestjs/swagger';
import { CreateProviderDto } from './create-provider.dto';

export class ResponseProviderDto extends OmitType(CreateProviderDto, [
  'user',
]) {}

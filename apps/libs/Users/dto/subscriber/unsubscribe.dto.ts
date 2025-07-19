import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { SubscribeDto } from './subscribe.dto';
import { IsUUID } from 'class-validator';

export class UnsubscribeDto extends OmitType(SubscribeDto, ['subscribeTo']) {
  @IsUUID()
  unsubscribeFrom: string;
}

export class UnsubscriberDto {
  @IsUUID()
  subscriber: string;
  @IsUUID()
  unsubscribeFrom: string;
}

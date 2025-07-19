import { ApiHideProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SubscribeDto {
  @ApiHideProperty()
  subscriber: string;
  @IsUUID()
  subscribeTo: string;
}

export class SubscriberDto {
  @IsUUID()
  subscriber: string;
  @IsUUID()
  subscribeTo: string;
}

import { IsUUID } from 'class-validator';

export class SubscribeDto {
  @IsUUID()
  subscriber: string;
  @IsUUID()
  subscribeTo: string;
}

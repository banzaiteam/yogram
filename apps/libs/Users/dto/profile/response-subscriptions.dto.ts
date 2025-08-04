import { Exclude, Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

class Subscribe {
  @IsUUID()
  id: string;
  @IsString()
  url: string;
  @IsString()
  username: string;
}

@Exclude()
export class ResponseSubscriptionsDto {
  @Expose()
  subscriber: Subscribe;
  @Expose()
  subscriptions: Subscribe[];
  @Expose()
  amount: number;
}

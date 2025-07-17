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
export class ResponseSubscribedOnDto {
  @Expose()
  subscriber: Subscribe;
  @Expose()
  subscribed: Subscribe[];
}

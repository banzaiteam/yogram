import { IsString, IsUUID } from 'class-validator';

class Subscribe {
  @IsUUID()
  id: string;
  @IsString()
  url: string;
  @IsString()
  username: string;
}

export class ResponseSubscribersDto {
  user: Subscribe;
  subscribers: Subscribe[];
  amount: number;
}

import { Provider } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { ResponseProfileDto } from './response-profile.dto';

@Exclude()
export class ResponseUserDto {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  verified: boolean;
  @Expose()
  providers: Provider[];
  @Expose()
  profile: ResponseProfileDto;
}

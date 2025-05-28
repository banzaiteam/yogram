import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseProfileDto } from './response-profile.dto';
import { ResponseProviderDto } from '../provider/response-provider.dto';

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
  // @Exclude()
  // providers: ResponseProviderDto[];
  @Expose()
  profile: ResponseProfileDto;
}

import { Exclude, Expose, Type } from 'class-transformer';
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
  url: string;
  @Expose()
  verified: boolean;
  @Expose()
  @Type(() => ResponseProfileDto)
  profile: ResponseProfileDto;
}

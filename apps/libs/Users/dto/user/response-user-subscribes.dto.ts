import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseProfileDto } from './response-profile.dto';

@Exclude()
export class ResponseUserSubscribesDto {
  @Expose()
  id: string;
  @Expose()
  url: string;
  @Expose()
  @Type(() => ResponseProfileDto)
  profile: ResponseProfileDto;
}

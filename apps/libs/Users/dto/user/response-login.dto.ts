import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseProfileDto } from './response-profile.dto';

@Exclude()
export class ResponseLoginDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  password: string;
  @Expose()
  verified: boolean;
  @Expose()
  firstname?: string;
  @Expose()
  lastname?: string;
  @Expose()
  birthdate?: Date;
  @Expose()
  country?: string;
  @Expose()
  city?: string;
  @Expose()
  @Type(() => ResponseProfileDto)
  profile: ResponseProfileDto;
}

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseUserDto {
  @Expose()
  id: string;
  // @Expose()
  firstName: string;
  // @Expose()
  lastName: string;
  @Expose()
  username: string;
  // @Expose()
  birthdate: Date;
  @Expose()
  email: string;
  // @Expose()
  country: string;
}
